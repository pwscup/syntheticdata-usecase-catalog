import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AiAssistPanel from '../components/case-form/AiAssistPanel'

describe('AiAssistPanel', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    })
  })

  it('パネルがデフォルトで折りたたまれていること', () => {
    render(<AiAssistPanel mode="create" onImport={() => {}} />)

    expect(screen.getByText('AI で入力を補助する')).toBeInTheDocument()
    expect(screen.queryByText('プロンプト')).not.toBeInTheDocument()
  })

  it('折りたたみが動作すること', async () => {
    const user = userEvent.setup()
    render(<AiAssistPanel mode="create" onImport={() => {}} />)

    expect(screen.queryByText('プロンプト')).not.toBeInTheDocument()

    await user.click(screen.getByText('AI で入力を補助する'))
    expect(screen.getByText('プロンプト')).toBeInTheDocument()

    await user.click(screen.getByText('AI で入力を補助する'))
    expect(screen.queryByText('プロンプト')).not.toBeInTheDocument()
  })

  it('プロンプトコピーボタンが動作すること', async () => {
    render(<AiAssistPanel mode="create" onImport={() => {}} />)

    fireEvent.click(screen.getByText('AI で入力を補助する'))
    fireEvent.click(screen.getByText('プロンプトをコピー'))

    await screen.findByText(/コピーしました/)
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('合成データ')
    )
  })

  it('インポートテキストエリアが表示されること', () => {
    render(<AiAssistPanel mode="create" onImport={() => {}} />)

    fireEvent.click(screen.getByText('AI で入力を補助する'))
    expect(screen.getByPlaceholderText('AIが出力したJSONをここに貼り付け...')).toBeInTheDocument()
    expect(screen.getByText('インポート')).toBeInTheDocument()
  })

  it('createモードとeditモードでプロンプトテキストが異なること', () => {
    const { unmount } = render(<AiAssistPanel mode="create" onImport={() => {}} />)
    fireEvent.click(screen.getByText('AI で入力を補助する'))
    // createモードでは「事例を抽出し」という文言が含まれる
    expect(screen.getAllByText(/事例を抽出し/).length).toBeGreaterThan(0)

    unmount()

    render(
      <AiAssistPanel
        mode="edit"
        currentCaseJson='{"title":"テスト"}'
        onImport={() => {}}
      />
    )
    fireEvent.click(screen.getByText('AI で入力を補助する'))
    // editモードでは「既存事例JSON」という文言が含まれる
    expect(screen.getAllByText(/既存事例JSON/).length).toBeGreaterThan(0)
  })

  it('有効なJSONをインポートできること', async () => {
    const user = userEvent.setup()
    const onImport = vi.fn()
    render(<AiAssistPanel mode="create" onImport={onImport} />)

    await user.click(screen.getByText('AI で入力を補助する'))
    const textarea = screen.getByPlaceholderText('AIが出力したJSONをここに貼り付け...')
    // sources が必須なので最低限のバリデーションを通すJSONを用意
    const validJson = JSON.stringify({
      title: 'テスト事例',
      sources: [{ source_type: 'web', url: 'https://example.com' }],
    })
    // user.type は { を特殊キーとして解釈するため fireEvent.change を使用
    fireEvent.change(textarea, { target: { value: validJson } })
    await user.click(screen.getByText('インポート'))

    await waitFor(() => {
      expect(onImport).toHaveBeenCalledTimes(1)
    })
    expect(screen.getByText(/フォームに反映しました/)).toBeInTheDocument()
  })

  it('無効なJSONでエラーが表示されること', async () => {
    const user = userEvent.setup()
    const onImport = vi.fn()
    render(<AiAssistPanel mode="create" onImport={onImport} />)

    await user.click(screen.getByText('AI で入力を補助する'))
    const textarea = screen.getByPlaceholderText('AIが出力したJSONをここに貼り付け...')
    await user.clear(textarea)
    await user.type(textarea, 'これはJSONではない')
    await user.click(screen.getByText('インポート'))

    expect(onImport).not.toHaveBeenCalled()
    // 実際のエラーメッセージを確認（エラー表示の span 要素を特定）
    expect(screen.getByText(/JSONを検出できませんでした/)).toBeInTheDocument()
  })
})

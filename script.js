function App() {
  return (
    <div style={{ padding: '2rem', color: 'white', textAlign: 'center', fontSize: '1.5rem' }}>
      <h1>テストページ</h1>
      <p>このメッセージが表示されていれば、基本設定は正常です。</p>
      <p>原因の切り分けができましたので、元のアプリの修正に戻ります。</p>
    </div>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
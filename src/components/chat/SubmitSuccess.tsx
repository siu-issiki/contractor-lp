interface SubmitSuccessProps {
  estimateNumber: string;
}

export default function SubmitSuccess({ estimateNumber }: SubmitSuccessProps) {
  return (
    <div className="p-6 text-center space-y-4">
      <div className="text-4xl">&#x2705;</div>
      <h3 className="text-lg font-bold text-gray-900">
        見積もりを送信しました
      </h3>
      <p className="text-sm text-gray-600">
        見積番号: <span className="font-mono font-medium">{estimateNumber}</span>
      </p>
      <p className="text-sm text-gray-600">
        ご入力いただいたメールアドレスに見積書(PDF)をお送りしました。
        <br />
        詳細なヒアリング後、正式なお見積もりをご提示させていただきます。
      </p>
      <p className="text-xs text-gray-500">
        ※ メールが届かない場合は迷惑メールフォルダをご確認ください。
      </p>
    </div>
  );
}

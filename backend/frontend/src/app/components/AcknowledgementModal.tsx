import { X } from 'lucide-react';

type Props = {
  open: boolean;
  type: 'success' | 'error';
  message: string;
  title?: string;
  confirmLabel?: string;
  onConfirm: () => void;
};

export function AcknowledgementModal({
  open,
  type,
  message,
  title,
  confirmLabel = 'OK',
  onConfirm,
}: Props) {
  if (!open) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className={`px-6 py-4 border-b ${isSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className={`text-lg font-bold ${isSuccess ? 'text-emerald-800' : 'text-red-800'}`}>
                {title || (isSuccess ? 'Success' : 'Attention')}
              </h3>
            </div>
            <button onClick={onConfirm} className={`p-2 rounded-full ${isSuccess ? 'hover:bg-emerald-100' : 'hover:bg-red-100'}`}>
              <X className={`w-5 h-5 ${isSuccess ? 'text-emerald-700' : 'text-red-700'}`} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
        </div>

        <div className="px-6 pb-6 flex justify-end">
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl font-semibold text-white ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
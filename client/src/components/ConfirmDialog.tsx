import { ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  isDanger?: boolean
  disabled?: boolean
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  disabled = false,
  onConfirm,
  onCancel,
  children
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (disabled ? null : onCancel())}
      />

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-60 ${
              isDanger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

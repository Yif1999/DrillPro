import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = '确认操作',
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="confirm-dialog-backdrop">
      <div className="confirm-dialog">
        <h4>{title}</h4>
        <div>{message}</div>
        <div className="confirm-dialog-actions">
          <button className="btn-text btn-cancel" onClick={onCancel}>取消</button>
          <button className="btn-text btn-confirm" onClick={onConfirm} autoFocus>确定</button>
        </div>
      </div>
      <style>{`
        .confirm-dialog-backdrop {
          position: fixed; left: 0; top: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; z-index: 9999;
        }
        .confirm-dialog {
          background: #fff; padding: 24px 32px; border-radius: 8px; min-width: 300px; box-shadow: 0 2px 12px #0002;
        }
        .confirm-dialog-actions { margin-top: 16px; text-align: right; }
        .btn-text {
          background: none;
          border: none;
          padding: 6px 16px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .btn-cancel {
          color: #888;
        }
        .btn-cancel:hover {
          background: #f0f0f0;
        }
        .btn-confirm {
          color: #1976d2;
          font-weight: 500;
        }
        .btn-confirm:hover {
          background: #e3f0fd;
        }
      `}</style>
    </div>
  );
};
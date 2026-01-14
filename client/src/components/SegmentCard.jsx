import { useEffect, useRef, useState } from 'react';

function SegmentCard({ segment, index, onSave }) {
  const textareaRef = useRef(null);
  const outputRef = useRef(null);
  const initializedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Prevent double initialization from React StrictMode
    if (initializedRef.current) return;
    
    const initAnnotator = async () => {
      const module = await import('https://cdn.jsdelivr.net/npm/rsml@latest/rsml.esm.js');
      const RSMLAnnotator = module.default;
      
      if (textareaRef.current && outputRef.current) {
        new RSMLAnnotator({
          textarea: textareaRef.current,
          output: outputRef.current,
        });
        initializedRef.current = true;
      }
    };

    initAnnotator();
  }, []);

  const handleSave = async () => {
    if (!textareaRef.current) return;

    setSaving(true);
    setSaveStatus('');

    const rsmlData = textareaRef.current.value;
    const result = await onSave(segment.id, rsmlData);

    setSaving(false);
    if (result.success) {
      setSaveStatus('✓ Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } else {
      setSaveStatus('✗ Failed');
    }
  };

  const verbatim = segment.unsanitized_verbatim || '';
  const normalized = segment.unsanitized_normalized || '';
  const transcript = segment.rsml || verbatim;

  return (
    <div className="card mb-4 shadow-sm border-0 segment-card" data-segment={segment.segment}>
      <div className="card-body p-4">
        {/* Segment Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="badge bg-primary fs-5 px-4 py-2 rounded-pill">
            Segment {index + 1}
          </span>
          <div className="d-flex gap-3 align-items-center">
            {saveStatus && <span className="text-success fw-semibold">{saveStatus}</span>}
            <button 
              className="btn btn-success px-5 py-2 rounded-pill"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="row mb-4 g-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold mb-2">RSML Editor</label>
            <textarea
              ref={textareaRef}
              className="form-control tag-textarea"
              rows="6"
              defaultValue={transcript}
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold mb-2">Preview</label>
            <div ref={outputRef} className="rendered-transcript card p-3" style={{ minHeight: '140px' }}></div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="mb-4">
          {segment.audio_path ? (
            <audio controls preload="metadata" style={{ width: '100%', height: '40px' }}>
              <source src={segment.audio_path} />
            </audio>
          ) : (
            <div className="alert alert-warning py-2 mb-0">⚠️ No audio available</div>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-3 pt-3 border-top">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="text-muted small">
                <strong className="d-block mb-1">Verbatim:</strong>
                <span className="text-secondary">{verbatim.substring(0, 100)}{verbatim.length > 100 ? '...' : ''}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-muted small">
                <strong className="d-block mb-1">Normalized:</strong>
                <span className="text-secondary">{normalized.substring(0, 100)}{normalized.length > 100 ? '...' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SegmentCard;

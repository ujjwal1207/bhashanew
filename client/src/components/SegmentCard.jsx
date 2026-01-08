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
    <div className="card mb-4 p-3 segment-card" data-segment={segment.segment}>
      {/* Segment Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="badge bg-primary fs-6">
          Segment {index + 1}
        </span>
        <div className="d-flex gap-2 align-items-center">
          {saveStatus && <span className="text-success small">{saveStatus}</span>}
          <button 
            className="btn btn-sm btn-success"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="row mb-2">
        <div className="col-md-6">
          <label className="form-label small">RSML Editor</label>
          <textarea
            ref={textareaRef}
            className="form-control tag-textarea"
            rows="5"
            defaultValue={transcript}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Preview</label>
          <div ref={outputRef} className="rendered-transcript card p-2" style={{ minHeight: '120px' }}></div>
        </div>
      </div>

      {/* Audio Player */}
      {segment.audio_path ? (
        <audio controls preload="metadata" style={{ width: '100%' }}>
          <source src={segment.audio_path} />
        </audio>
      ) : (
        <div className="text-muted small">⚠️ No audio available</div>
      )}

      {/* Metadata */}
      <div className="mt-2 small text-muted">
        <div className="row">
          <div className="col-md-6">
            <strong>Verbatim:</strong> {verbatim.substring(0, 100)}{verbatim.length > 100 ? '...' : ''}
          </div>
          <div className="col-md-6">
            <strong>Normalized:</strong> {normalized.substring(0, 100)}{normalized.length > 100 ? '...' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SegmentCard;

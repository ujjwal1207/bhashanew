import { useEffect, useRef } from 'react';

function SegmentCard({ segment, audioBase }) {
  const textareaRef = useRef(null);
  const outputRef = useRef(null);
  const initializedRef = useRef(false);

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

  const verbatim = segment.unsanitized_verbatim || '';
  const normalized = segment.unsanitized_normalized || '';
  const transcript = segment.rsml || verbatim;
  const audioPath = segment.audio ? audioBase + segment.audio : null;

  return (
    <div className="card mb-4 p-3 segment-card" data-segment={segment.segment}>
      {/* Segment Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="badge border border-black text-black rounded-circle fs-6">
          {segment.segment}
        </span>
      </div>

      {/* Main Content Row */}
      <div className="row mb-2">
        <div className="col-md-6">
          <textarea
            ref={textareaRef}
            className="form-control tag-textarea"
            rows="5"
            defaultValue={transcript}
          />
        </div>
        <div className="col-md-6">
          <div ref={outputRef} className="rendered-transcript card p-2"></div>
        </div>
      </div>

      {/* Audio Player */}
      {audioPath ? (
        <audio controls preload="metadata" style={{ width: '100%' }}>
          <source src={audioPath} />
        </audio>
      ) : (
        <div className="text-muted small">⚠️ No audio</div>
      )}
    </div>
  );
}

export default SegmentCard;

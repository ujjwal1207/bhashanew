function GuidelinesModal() {
  return (
    <div
      className="modal fade"
      id="guidelinesModal"
      tabIndex="-1"
      aria-labelledby="guidelinesModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title fw-semibold" id="guidelinesModalLabel">
              RSML Annotation Shortcuts
            </h6>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body small">
            <p>
              <strong>@ — Noise / Disfluency:</strong> mark ambient or speaker noises.
            </p>
            <p className="ms-3 bg-gray rounded p-2">
              <code>@noise</code>, <code>@background-laughter</code>, <code>@cough</code>
            </p>

            <p>
              <strong># or {'{}'} — Entities:</strong>{' '}
              <code>#TYPE{'{verbatim}'}(normalized)</code>
            </p>
            <p className="ms-3 bg-gray rounded p-2">
              <code>{'{सूर्य देव}'}(सूर्य देव)</code>
              <br />
              <code>#PER{'{रमेश}'}(रमेश)</code>
              <br />
              <code>#ORG{'{भारतीय रयिलवे}'}(भारतीय रेल्वे)</code>
              <br />
              <code>#GPE{'{नयी दिल्ली}'}(नई ढिल्ली)</code>
              <br />
              <code>#YEAR{'{उन्नीस सौ पचासी}'}(1985)</code>
            </p>

            <p>
              <strong>! or [ ] — Code-Mix:</strong> native script → mixed-language form
            </p>
            <p className="ms-3 bg-gray rounded p-2">
              <code>!en[ट्रेन](train)</code>, <code>[स्टडी](study)</code>
            </p>

            <p>
              <strong>$ — Accent (explicit):</strong>{' '}
              <code>$accent&lt;verbatim&gt;(normalized)</code>
            </p>
            <p className="ms-3 bg-gray rounded p-2">
              <code>$british&lt;wa'er&gt;(water)</code>
              <br />
              <code>$telugu&lt;iskool&gt;(school)</code>
            </p>

            <p>
              <strong>&lt; &gt; — Accent / Mispronunciation (generic):</strong>{' '}
              <code>&lt;verbatim&gt;(normalized)</code>
            </p>
            <p className="ms-3 bg-gray rounded p-2">
              <code>&lt;हमाये&gt;(हमारे)</code>
              <br />
              <code>&lt;समझनाहीं&gt;(समझ नहीं)</code>
            </p>

            <small className="text-muted ms-3 d-block">
              Use <code>$accent</code> when the pronunciation is dialectal or systematic. Use{' '}
              <code>&lt; &gt;</code> when the cause is unclear or speaker-specific.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidelinesModal;

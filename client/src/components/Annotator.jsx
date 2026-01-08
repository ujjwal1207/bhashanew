import { useState, useEffect } from 'react';
import { api } from '../services/api';
import SegmentCard from './SegmentCard';
import GuidelinesModal from './GuidelinesModal';
import * as bootstrap from 'bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AUDIO_BASE = '/data/audio/';

function Annotator() {
  const [batches, setBatches] = useState([]);
  const [files, setFiles] = useState([]);
  const [segments, setSegments] = useState([]);
  const [currentBatch, setCurrentBatch] = useState('');
  const [currentFile, setCurrentFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const { max_batch } = await api.getBatches();
      const batchList = Array.from({ length: max_batch }, (_, i) => i + 1);
      setBatches(batchList);
    } catch (err) {
      setError('Failed to load batches');
    }
  };

  const handleBatchChange = async (e) => {
    const batch = e.target.value;
    setCurrentBatch(batch);
    setCurrentFile('');
    setSegments([]);
    
    if (!batch) return;

    try {
      const data = await api.getFiles(batch);
      setFiles(data.files || []);
    } catch (err) {
      setError('Failed to load files');
    }
  };

  const handleFileChange = (e) => {
    setCurrentFile(e.target.value);
  };

  const handleLoadSegments = async () => {
    if (!currentBatch || !currentFile) {
      alert('Please select both batch and file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.getFile(currentBatch, currentFile);
      
      const processedSegments = data.map(seg => ({
        ...seg,
        audio_path: `${AUDIO_BASE}${seg.audio_filepath}`
      }));
      
      setSegments(processedSegments);
    } catch (err) {
      setError('Failed to load segments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (segmentId, rsmlData) => {
    try {
      await api.saveRsml(segmentId, rsmlData);
      
      setSegments(prevSegments =>
        prevSegments.map(seg =>
          seg.id === segmentId ? { ...seg, rsml: rsmlData } : seg
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Save failed:', err);
      return { success: false, error: err.message };
    }
  };

  const handleSaveAll = async () => {
    if (segments.length === 0) return;

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const segment of segments) {
      try {
        await api.saveRsml(segment.id, segment.rsml || '');
        successCount++;
      } catch (err) {
        console.error(`Failed to save segment ${segment.id}:`, err);
        failCount++;
      }
    }

    setLoading(false);

    if (failCount === 0) {
      alert(`Successfully saved all ${successCount} segments!`);
    } else {
      alert(`Saved ${successCount} segments. Failed to save ${failCount} segments.`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePrev = () => {
    const currentIndex = files.indexOf(parseInt(currentFile));
    if (currentIndex > 0) {
      const prevFile = files[currentIndex - 1].toString();
      setCurrentFile(prevFile);
      loadFileSegments(prevFile);
    }
  };

  const handleNext = () => {
    const currentIndex = files.indexOf(parseInt(currentFile));
    if (currentIndex < files.length - 1) {
      const nextFile = files[currentIndex + 1].toString();
      setCurrentFile(nextFile);
      loadFileSegments(nextFile);
    }
  };

  const loadFileSegments = async (fileNumber) => {
    if (!currentBatch) return;

    setLoading(true);
    setError('');

    try {
      const data = await api.getFile(currentBatch, fileNumber);
      
      const processedSegments = data.map(seg => ({
        ...seg,
        audio_path: `${AUDIO_BASE}${seg.audio_filepath}`
      }));
      
      setSegments(processedSegments);
    } catch (err) {
      setError('Failed to load segments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-primary text-white py-2 shadow-sm">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="mb-0">RSML Speech Annotator</h4>
            </div>
            <div className="col-auto">
              <div className="d-flex align-items-center gap-2">
                <button 
                  className="btn btn-info btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#guidelinesModal"
                >
                  <i className="bi bi-keyboard"></i> Shortcuts
                </button>
                {isAdmin && (
                  <button 
                    className="btn btn-light btn-sm"
                    onClick={() => navigate('/admin')}
                  >
                    Admin Panel
                  </button>
                )}
                <button 
                  className="btn btn-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 bg-light py-3">
        <div className="container-fluid">
          {/* Control Panel */}
          <div className="card mb-3 shadow-sm">
            <div className="card-body py-2">
              <div className="row g-2 align-items-end">
                <div className="col-md-2">
                  <label className="form-label mb-1 small">Batch</label>
                  <select 
                    className="form-select form-select-sm"
                    value={currentBatch}
                    onChange={handleBatchChange}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch} value={batch}>Batch {batch}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-2">
                  <label className="form-label mb-1 small">File</label>
                  <select 
                    className="form-select form-select-sm"
                    value={currentFile}
                    onChange={handleFileChange}
                    disabled={!currentBatch}
                  >
                    <option value="">Select File</option>
                    {files.map(file => (
                      <option key={file} value={file}>File {file}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-3 d-flex gap-1">
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handlePrev}
                    disabled={!currentFile || files.indexOf(parseInt(currentFile)) === 0}
                    title="Previous File"
                  >
                    ← Prev
                  </button>
                  <button 
                    className="btn btn-primary btn-sm flex-fill"
                    onClick={handleLoadSegments}
                    disabled={loading || !currentBatch || !currentFile}
                  >
                    {loading ? 'Loading...' : 'Load'}
                  </button>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleNext}
                    disabled={!currentFile || files.indexOf(parseInt(currentFile)) === files.length - 1}
                    title="Next File"
                  >
                    Next →
                  </button>
                </div>

                {segments.length > 0 && (
                  <div className="col-md-2">
                    <button 
                      className="btn btn-success btn-sm w-100"
                      onClick={handleSaveAll}
                      disabled={loading}
                    >
                      <i className="bi bi-save"></i> Save All RSML
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="alert alert-danger mt-2 mb-0 py-1" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Segments List */}
          {segments.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="d-flex flex-column gap-3">
                  {segments.map((segment, index) => (
                    <SegmentCard 
                      key={segment.id}
                      segment={segment}
                      index={index}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {segments.length === 0 && !loading && (
            <div className="text-center text-muted py-5">
              <p>Select a batch and file to load segments</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2">
        <p className="mb-0 small">RSML Speech Annotation Tool &copy; 2024</p>
      </footer>

      {/* Guidelines Modal */}
      <GuidelinesModal />
    </div>
  );
}

export default Annotator;

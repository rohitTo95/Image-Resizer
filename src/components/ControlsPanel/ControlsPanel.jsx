import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageContext } from '../../context/ImageContext';
import { getSuggestedSizes } from '../../utils/image/grouping';
import { calculateFromWidth, calculateFromHeight } from '../../utils/image/resize';
import { useImageWorker } from '../../hooks/useImageWorker';
import styles from './ControlsPanel.module.css';

export default function ControlsPanel({ group }) {
  const navigate = useNavigate();
  const {
    settings,
    customResize,
    updateSettings,
    setCustomResize,
    setProcessing,
    setProgress,
    setProcessedImages,
    processing,
  } = useImageContext();

  const { processBatch } = useImageWorker();
  const [selectedSize, setSelectedSize] = useState(null);
  const [customMode, setCustomMode] = useState(false);

  const suggestions = group ? getSuggestedSizes(group) : null;

  const groupHasJpeg = group?.images.some(
    (img) => img.type === 'image/jpeg' || /\.jpe?g$/i.test(img.name),
  );

  useEffect(() => {
    setSelectedSize(null);
    setCustomMode(false);
  }, [group?.id]);

  function handleWidthChange(val) {
    const w = parseInt(val, 10);
    if (!group || isNaN(w) || w <= 0) {
      setCustomResize({ width: val, height: customResize.height });
      return;
    }
    const dims = calculateFromWidth(group.width, group.height, w);
    setCustomResize({ width: String(w), height: String(dims.height) });
    setSelectedSize(null);
  }

  function handleHeightChange(val) {
    const h = parseInt(val, 10);
    if (!group || isNaN(h) || h <= 0) {
      setCustomResize({ width: customResize.width, height: val });
      return;
    }
    const dims = calculateFromHeight(group.width, group.height, h);
    setCustomResize({ width: String(dims.width), height: String(h) });
    setSelectedSize(null);
  }

  function selectSuggestion(size) {
    setSelectedSize(size);
    setCustomResize({ width: String(size.width), height: String(size.height) });
    setCustomMode(false);
  }

  async function handleProcess() {
    if (!group) return;
    const tw = parseInt(customResize.width, 10);
    const th = parseInt(customResize.height, 10);
    if (!tw || !th) return;

    setProcessing(true);
    setProgress({ current: 0, total: group.images.length });

    try {
      const results = await processBatch(
        group.images,
        tw,
        th,
        settings,
        (current, total) => setProgress({ current, total }),
      );
      setProcessedImages({ [group.id]: results });
      navigate('/preview');
    } catch (err) {
      console.error('Processing failed:', err);
    } finally {
      setProcessing(false);
    }
  }

  if (!group) return null;

  const canProcess = customResize.width && customResize.height && !processing;

  return (
    <div className={styles.panel}>
      {/* Resize suggestions */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.badge}>Safe Resize</span>
          Suggested sizes
        </h3>
        <p className={styles.sectionDesc}>
          All options maintain the {suggestions?.ratio} aspect ratio — no cropping.
        </p>

        <div className={styles.suggestions}>
          <div className={styles.group}>
            <p className={styles.groupLabel}>Percentage</p>
            <div className={styles.pills}>
              {suggestions?.percentages.map((s) => (
                <button
                  key={s.label}
                  className={`${styles.pill} ${selectedSize?.label === s.label ? styles.pillActive : ''}`}
                  onClick={() => selectSuggestion(s)}
                >
                  <span className={styles.pillLabel}>{s.label}</span>
                  <span className={styles.pillSub}>{s.sublabel}</span>
                </button>
              ))}
            </div>
          </div>

          {suggestions?.presets.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupLabel}>Web presets</p>
              <div className={styles.pills}>
                {suggestions.presets.map((s) => (
                  <button
                    key={s.label}
                    className={`${styles.pill} ${selectedSize?.label === s.label ? styles.pillActive : ''}`}
                    onClick={() => selectSuggestion(s)}
                  >
                    <span className={styles.pillLabel}>{s.sublabel}</span>
                    <span className={styles.pillSub}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Custom resize */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Custom size</h3>
        <div className={styles.customRow}>
          <label className={styles.dimInput}>
            <span className={styles.dimLabel}>W</span>
            <input
              type="number"
              min="1"
              value={customResize.width}
              onChange={(e) => { setCustomMode(true); handleWidthChange(e.target.value); }}
              placeholder={group.width}
              className={styles.input}
              aria-label="Target width in pixels"
            />
            <span className={styles.dimUnit}>px</span>
          </label>
          <span className={styles.x}>×</span>
          <label className={styles.dimInput}>
            <span className={styles.dimLabel}>H</span>
            <input
              type="number"
              min="1"
              value={customResize.height}
              onChange={(e) => { setCustomMode(true); handleHeightChange(e.target.value); }}
              placeholder={group.height}
              className={styles.input}
              aria-label="Target height in pixels"
            />
            <span className={styles.dimUnit}>px</span>
          </label>
        </div>
      </section>

      {/* Crop toggle */}
      <section className={styles.section}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={settings.cropEnabled}
            onChange={(e) => updateSettings({ cropEnabled: e.target.checked })}
            className={styles.checkbox}
          />
          <span className={styles.toggleLabel}>Allow crop (advanced)</span>
        </label>
        {settings.cropEnabled && (
          <p className={styles.warning} role="alert">
            <WarningIcon />
            This will crop parts of your image to fit exact dimensions.
          </p>
        )}
      </section>

      {/* WebP conversion */}
      <section className={styles.section}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={settings.webpEnabled}
            onChange={(e) => updateSettings({ webpEnabled: e.target.checked })}
            className={styles.checkbox}
          />
          <span className={styles.toggleLabel}>Convert to WebP</span>
        </label>

        {settings.webpEnabled && (
          <div className={styles.webpOptions}>
            <div className={styles.modeGroup}>
              {['lossless', 'high', 'custom'].map((mode) => (
                <label key={mode} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="webpMode"
                    value={mode}
                    checked={settings.webpMode === mode}
                    onChange={() => updateSettings({ webpMode: mode })}
                    className={styles.radio}
                  />
                  <span>
                    {mode === 'lossless' ? 'Lossless' : mode === 'high' ? 'High Quality' : 'Custom'}
                  </span>
                </label>
              ))}
            </div>

            {settings.webpMode === 'custom' && (
              <div className={styles.sliderRow}>
                <label className={styles.sliderLabel}>
                  Quality: <strong>{settings.webpQuality}</strong>
                </label>
                <input
                  type="range"
                  min="80"
                  max="100"
                  value={settings.webpQuality}
                  onChange={(e) => updateSettings({ webpQuality: Number(e.target.value) })}
                  className={styles.slider}
                  aria-label="WebP quality"
                />
                <div className={styles.sliderTicks}>
                  <span>80</span><span>90</span><span>100</span>
                </div>
              </div>
            )}

            {settings.webpMode === 'high' && (
              <p className={styles.helpText}>
                High Quality mode reduces file size with minimal visible loss.
              </p>
            )}

            {settings.webpMode === 'lossless' && groupHasJpeg && (
              <p className={styles.warning} role="alert">
                <WarningIcon />
                JPEG sources will likely get <strong>larger</strong> with lossless — JPEGs are already lossy-compressed. Use High Quality for smaller output.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Process button */}
      <button
        className={styles.processBtn}
        onClick={handleProcess}
        disabled={!canProcess}
        aria-busy={processing}
      >
        {processing ? (
          <>
            <span className={styles.btnSpinner} aria-hidden="true" />
            Processing...
          </>
        ) : (
          <>
            <ProcessIcon />
            Process {group.images.length} image{group.images.length !== 1 ? 's' : ''}
          </>
        )}
      </button>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ProcessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

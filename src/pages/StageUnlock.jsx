import { useParams, useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../data/index.js';
import './StageUnlock.css';

export default function StageUnlock() {
  const { langId, stageId } = useParams();
  const navigate = useNavigate();
  const lang = LANGUAGES[langId];
  const stage = lang?.stages.find(s => s.id === stageId);

  if (!lang || !stage) {
    navigate(`/learn/${langId}`);
    return null;
  }

  const nextStage = lang.stages.find(s => s.order === stage.order + 1);

  return (
    <div className="stage-unlock">
      <div className="su-content">
        {/* Emoji */}
        <div className="su-emoji">{stage.emoji}</div>

        {/* Stage label */}
        <div className="su-stage-label">
          Stage {stage.order} complete
        </div>

        {/* Narrative moment — the star */}
        <blockquote className="su-narrative">
          "{stage.unlockNarrative}"
        </blockquote>

        <p className="su-detail">{stage.unlockDetail}</p>

        {/* Divider */}
        <div className="su-divider" />

        {/* Next stage preview */}
        {nextStage && !nextStage.comingSoon && (
          <div className="su-next">
            <div className="su-next-label">Up next</div>
            <div className="su-next-card">
              <span className="su-next-emoji">{nextStage.emoji}</span>
              <div>
                <div className="su-next-title">{nextStage.title}</div>
                <div className="su-next-sub">{nextStage.subtitle}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="su-actions">
          <button
            className="su-continue-btn"
            onClick={() => navigate(`/learn/${langId}`)}
          >
            Continue learning
          </button>
          <button
            className="su-back-btn"
            onClick={() => navigate('/')}
          >
            Back to languages
          </button>
        </div>
      </div>
    </div>
  );
}

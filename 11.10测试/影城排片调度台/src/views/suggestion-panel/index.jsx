import { Button, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { suggestions } from "../../mock/suggestion.js";
import "./index.css";

const TYPE_TAG = {
  add: { label: "加场建议", color: "green" },
  reduce: { label: "减场建议", color: "orange" },
  conflict: { label: "冲突修复", color: "red" },
};

export default function SuggestionPanel({ adoptedSet, onAdopt }) {
  return (
    <div className="suggestion-section">
      <div className="suggestion-header">
        <div className="section-title">
          <Icon name="lightbulb" size="1.25rem" color="#0067D1" />
          <span>排片建议面板</span>
        </div>
      </div>
      <div className="suggestion-list">
        {suggestions.map(function (s) {
          const adopted = !!adoptedSet[s.suggestionId];
          const tag = TYPE_TAG[s.type] || { label: "建议", color: "blue" };
          return (
            <div key={s.suggestionId} className="suggestion-card">
              <div className="suggestion-card-header">
                <Tag color={tag.color} className="suggestion-type-tag">{tag.label}</Tag>
                <span className="suggestion-title">{s.title}</span>
              </div>
              <p className="suggestion-content">{s.content}</p>
              <div className="suggestion-footer">
                {adopted ? (
                  <span className="suggestion-adopted">
                    <Icon name="circle-check" size="0.875rem" color="#09AA71" />
                    已采纳
                  </span>
                ) : (
                  <Button size="small" type="primary" onClick={function () { onAdopt(s); }}>
                    采纳
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

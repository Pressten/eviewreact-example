import { useState } from "react";
import { Checkbox, Tag, message } from "antd";
import Icon from "@/shared/Icon";
import { useApp } from "../../context.jsx";
import { todos } from "../../mock/todos.js";
import { ownerMap } from "../../mock/salespeople.js";
import { actionTypes } from "../../mock/stages.js";
import "./index.css";

export default function MyTodo() {
  const { team } = useApp();
  const [done, setDone] = useState({});

  const list = todos.filter((t) => ownerMap[t.owner] && ownerMap[t.owner].team === team);
  const pending = list.filter((t) => !done[t.id]);
  const completed = list.filter((t) => done[t.id]);

  const handleCheck = (todo, checked) => {
    setDone((prev) => ({ ...prev, [todo.id]: checked }));
    if (checked) {
      message.success(`已完成「${todo.customer} · ${todo.label}」跟进任务`);
    }
  };

  return (
    <div className="todo">
      <div className="todo__summary">
        <div className="todo__summary-item">
          <span className="todo__summary-num todo__summary-num--pending">{pending.length}</span>
          <span className="todo__summary-label">待跟进</span>
        </div>
        <span className="todo__summary-sep" />
        <div className="todo__summary-item">
          <span className="todo__summary-num todo__summary-num--done">{completed.length}</span>
          <span className="todo__summary-label">已完成</span>
        </div>
        <div className="todo__summary-date">
          <Icon name="calendar-check" size="0.875rem" color="var(--on-surface-variant)" />
          今日 · 2026-10-21
        </div>
      </div>

      <div className="todo__list">
        {pending.length > 0 && (
          <div className="todo__group">
            <div className="todo__group-label">待跟进 · {pending.length}</div>
            {pending.map((t) => (
              <TodoRow key={t.id} todo={t} checked={!!done[t.id]} onCheck={handleCheck} />
            ))}
          </div>
        )}
        {completed.length > 0 && (
          <div className="todo__group">
            <div className="todo__group-label todo__group-label--done">已完成 · {completed.length}</div>
            {completed.map((t) => (
              <TodoRow key={t.id} todo={t} checked={!!done[t.id]} onCheck={handleCheck} />
            ))}
          </div>
        )}
        {pending.length === 0 && completed.length === 0 && (
          <div className="todo__empty">暂无今日跟进任务</div>
        )}
      </div>
    </div>
  );
}

function TodoRow({ todo, checked, onCheck }) {
  const owner = ownerMap[todo.owner];
  const action = actionTypes[todo.action] || { label: todo.label, color: "#2070F3" };
  return (
    <div className={`todo__row ${checked ? "is-done" : ""}`}>
      <Checkbox checked={checked} onChange={(e) => onCheck(todo, e.target.checked)}>
        <span className="todo__customer">{todo.customer}</span>
      </Checkbox>
      <div className="todo__row-right">
        <Tag color={action.color} bordered={false} className="todo__action-tag">{todo.label}</Tag>
        <span className="todo__time">
          <Icon name="clock" size="0.75rem" color="var(--on-surface-variant)" />
          {todo.plannedAt}
        </span>
        {owner && <span className="todo__owner" title={owner.name} style={{ color: owner.color }}>{owner.name}</span>}
      </div>
      <div className="todo__note">{todo.note}</div>
    </div>
  );
}

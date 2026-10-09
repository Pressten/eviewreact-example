#!/bin/bash
#
# 串行批处理脚本：自动处理所有项目
#
# - 提示词来源: 提示词.txt（{SRC} 占位符自动替换为项目绝对路径）
# - 每个项目的输出保存到 logs/ 目录，最后打印汇总
#
# 用法:
#   bash run_all.sh                # 处理全部项目
#   bash run_all.sh 简单页面        # 只处理指定项目（可多个，空格分隔）
#

# ===== 配置 =====
# 自动获取脚本所在目录作为 BASE_DIR
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$SCRIPT_DIR"
PROMPT_FILE="$BASE_DIR/提示词.txt"
LOG_DIR="$BASE_DIR/logs"
AUTO_APPROVE=true    # true=自动批准权限(无需手动确认), false=手动确认
SKIP_DONE=false      # true=跳过已有 -vite 目录的项目
MODEL=""             # 指定模型如 "bailian/glm-5.2"，留空用默认
# run   = 全自动(opencode run, 跑完自动退出, 子agent输出仅汇总)
# tui   = TUI窗口(能看到子agent完整输出, 处理完需手动按q退出)
MODE="run"
# =================

# 读取提示词模板（tr -d '\r' 去除 Windows 换行符）
PROMPT_TEMPLATE=$(cat "$PROMPT_FILE" | tr -d '\r')

# 创建日志目录
mkdir -p "$LOG_DIR"

# 构建附加参数
EXTRA_FLAGS=()
if [ "$AUTO_APPROVE" = true ]; then
  EXTRA_FLAGS+=("--auto")
fi
if [ -n "$MODEL" ]; then
  EXTRA_FLAGS+=("--model" "$MODEL")
fi

# 确定要处理的项目列表
if [ $# -gt 0 ]; then
  PROJECTS=("$@")
else
  PROJECTS=()
  for d in "$BASE_DIR"/*/; do
    name="$(basename "${d%/}")"
    [ "$name" = "logs" ] && continue
    PROJECTS+=("$name")
  done
fi

total=${#PROJECTS[@]}
echo "共 $total 个项目待处理 (模式: $MODE)"
echo ""

# 汇总结果
declare -a RESULTS

idx=0
for proj_name in "${PROJECTS[@]}"; do
  idx=$((idx + 1))
  proj_dir="$BASE_DIR/$proj_name"
  log_file="$LOG_DIR/${proj_name}.log"

  # 检查目录是否存在
  if [ ! -d "$proj_dir" ]; then
    echo "[$idx/$total] 跳过 $proj_name（目录不存在: $proj_dir）"
    RESULTS+=("SKIP  | $proj_name | 目录不存在")
    continue
  fi

  # 跳过已处理的项目
  if [ "$SKIP_DONE" = true ] && [ -d "${proj_dir}-vite" ]; then
    echo "[$idx/$total] 跳过 $proj_name（已存在 -vite 目录）"
    RESULTS+=("SKIP  | $proj_name | 已有 -vite 目录")
    continue
  fi

  echo "============================================"
  echo "  [$idx/$total] 开始处理: $proj_name"
  echo "  源目录: $proj_dir"
  echo "  日志:   $log_file"
  echo "============================================"

  # 替换 {SRC} 占位符为实际项目路径
  PROMPT="${PROMPT_TEMPLATE//\{SRC\}/$proj_dir}"

  if [ "$MODE" = "tui" ]; then
    # TUI 模式：能看到子 agent 完整输出，处理完需手动按 q 退出
    opencode "$proj_dir" --prompt "$PROMPT" "${EXTRA_FLAGS[@]}" 2>&1 | tee "$log_file"
  else
    # run 模式：全自动，跑完自动退出，无需手动操作
    opencode run --dir "$proj_dir" --title "$proj_name" "${EXTRA_FLAGS[@]}" "$PROMPT" 2>&1 | tee "$log_file"
  fi
  exit_code=${PIPESTATUS[0]}

  # 记录该项目的 token 消耗
  echo "" | tee -a "$log_file"
  echo "--- Token 统计 ---" | tee -a "$log_file"
  opencode stats --project "$proj_dir" 2>&1 | tee -a "$log_file"

  echo ">> [$idx/$total] $proj_name 处理结束 (exit=$exit_code)"
  RESULTS+=("$proj_name | exit=$exit_code")
  echo ""
done

# 打印汇总
echo "============================================"
echo "  汇总结果"
echo "============================================"
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo "===== 所有项目处理完毕 ====="
echo ""
echo "===== Token 总统计 ====="
opencode stats

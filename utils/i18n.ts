
import { Language } from '../types';

export const translations = {
  zh: {
    nav: { home: '首页', calendar: '日历', planner: '计划', finance: '记账', dashboard: '报表' },
    settings: {
      title: '设置',
      clear_data: '数据管理',
      clear_tasks: '清空所有任务',
      clear_finance: '清空所有账目',
      reset_all: '重置所有数据 (恢复出厂)',
      confirm_title: '确认操作',
      confirm_msg: '此操作无法撤销，确定要清空吗？',
      cancel: '取消',
      confirm: '确认清除',
      cleared: '数据已清除'
    },
    home: {
      pending_tasks: '今日剩余任务',
      view_details: '去查看',
      quick_task: '快速添加任务',
      quick_task_ph: '接下来要做什么？',
      quick_finance: '极速记账',
      quick_finance_ph: '例如：打车花了35元',
      add: '添加',
      record: '记录',
      processing: '分析中...',
      saved: '已保存',
      error_ai: 'AI 无法识别，请尝试更清晰的描述。',
      record_success: '已记录: ',
    },
    calendar: {
      month_unit: '月',
      year_unit: '年',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      no_tasks: '这一天没有安排任务',
      edit_details: '去编辑详情',
      schedule: '的安排'
    },
    planner: {
      daily_plan: '每日计划',
      add_placeholder: '添加一个新任务...',
      thinking: '思考中...',
      ai_advice: 'AI 建议',
      get_advice_ph: '获取今日 AI 规划建议...',
      empty: '当日暂无安排',
      priorities: { high: '重要', medium: '普通', low: '日常' }
    },
    finance: {
      budget_title: '本月预算',
      spent: '已支出',
      usage_rate: '使用率',
      remaining: '剩余',
      smart_mode: '智能模式',
      manual_mode: '手动模式',
      switch_manual: '切换手动',
      switch_smart: '切换智能',
      smart_ph: '例如：超市买菜花了120元...',
      record_btn: '记录交易',
      save_btn: '保存交易',
      recent_transactions: '近期交易',
      no_transactions: '还没有交易记录',
      categories: {
        Food: '餐饮', Transport: '交通', Housing: '居住', Shopping: '购物',
        Entertainment: '娱乐', Salary: '工资', Investment: '理财', Other: '其他'
      },
      types: { income: '收入', expense: '支出' },
      labels: { amount: '金额', desc: '备注', category: '分类', type: '类型' }
    },
    dashboard: {
      income: '收入',
      expense: '支出',
      balance: '结余',
      ai_insight: 'AI 财务洞察',
      analyzing: '正在分析您的消费习惯...',
      no_data: '暂无足够数据进行分析。',
      expense_structure: '支出构成',
      income_vs_expense: '收支对比',
      task_overview: '待办概览',
      remaining: '剩余',
      no_tasks: '暂无任务'
    }
  },
  en: {
    nav: { home: 'Home', calendar: 'Calendar', planner: 'Planner', finance: 'Finance', dashboard: 'Stats' },
    settings: {
      title: 'Settings',
      clear_data: 'Data Management',
      clear_tasks: 'Clear All Tasks',
      clear_finance: 'Clear All Transactions',
      reset_all: 'Factory Reset',
      confirm_title: 'Are you sure?',
      confirm_msg: 'This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      cleared: 'Data Cleared'
    },
    home: {
      pending_tasks: 'Pending Tasks',
      view_details: 'View',
      quick_task: 'Quick Task',
      quick_task_ph: 'What needs to be done?',
      quick_finance: 'Quick Expense',
      quick_finance_ph: 'e.g., Spent $15 on coffee',
      add: 'Add',
      record: 'Record',
      processing: 'Thinking...',
      saved: 'Saved',
      error_ai: 'AI could not understand. Please try again.',
      record_success: 'Recorded: ',
    },
    calendar: {
      month_unit: '',
      year_unit: '',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      no_tasks: 'No tasks scheduled for this day',
      edit_details: 'Edit Details',
      schedule: "'s Schedule"
    },
    planner: {
      daily_plan: 'Daily Plan',
      add_placeholder: 'Add a new task...',
      thinking: 'Thinking...',
      ai_advice: 'AI Tips',
      get_advice_ph: 'Get AI planning advice...',
      empty: 'No tasks for today',
      priorities: { high: 'High', medium: 'Medium', low: 'Low' }
    },
    finance: {
      budget_title: 'Monthly Budget',
      spent: 'Spent',
      usage_rate: 'Used',
      remaining: 'Left',
      smart_mode: 'Smart Mode',
      manual_mode: 'Manual',
      switch_manual: 'Manual',
      switch_smart: 'Smart AI',
      smart_ph: 'e.g., Grocery shopping cost $50...',
      record_btn: 'Record',
      save_btn: 'Save',
      recent_transactions: 'Recent',
      no_transactions: 'No transactions yet',
      categories: {
        Food: 'Food', Transport: 'Transport', Housing: 'Housing', Shopping: 'Shopping',
        Entertainment: 'Fun', Salary: 'Salary', Investment: 'Invest', Other: 'Other'
      },
      types: { income: 'Income', expense: 'Expense' },
      labels: { amount: 'Amount', desc: 'Note', category: 'Category', type: 'Type' }
    },
    dashboard: {
      income: 'Income',
      expense: 'Expense',
      balance: 'Balance',
      ai_insight: 'AI Insight',
      analyzing: 'Analyzing your spending habits...',
      no_data: 'Not enough data for analysis.',
      expense_structure: 'Expenses',
      income_vs_expense: 'Cash Flow',
      task_overview: 'Tasks',
      remaining: 'Left',
      no_tasks: 'No tasks'
    }
  }
};

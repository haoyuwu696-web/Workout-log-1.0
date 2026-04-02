/**
 * ECharts 主题与 resize 工具（ESM）。
 * 在纯 HTML 页面中请使用 window.FitLogCommon.chart（见 scripts/core/app-common.js）。
 */
export const chartTheme = {
  color: ['#007AFF', '#4ADE80', '#FF9500', '#EF4444'],
  textStyle: {
    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
  },
  grid: {
    top: 10,
    right: 10,
    bottom: 20,
    left: 30,
    containLabel: true
  }
};

export function bindChartResize(chartInstance) {
  const handler = () => chartInstance?.resize();
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}


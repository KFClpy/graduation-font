import type { LocaleMessages } from 'vue-i18n';

const locale: LocaleMessages<I18nType.Schema> = {
  message: {
    system: {
      title: 'FuzzyJoin管理系统'
    },
    routes: {
      dashboard: {
        dashboard: '模糊连接',
        analysis: '分析页',
        workbench: '工作台'
      },
      about: {
        about: '关于'
      }
    }
  }
};

export default locale;

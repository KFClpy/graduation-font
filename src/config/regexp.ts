/** 手机号码正则 */
export const REGEXP_PHONE =
  /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/;

/** 邮箱正则 */
export const REGEXP_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/** 密码正则(密码为6-18位数字/字符/符号的组合) */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,18}$/;

export const REGEXP_USERNAME = /^[a-zA-Z0-9]{6,12}$/;
/** 6位数字验证码正则 */
export const REGEXP_CODE_SIX = /^\d{6}$/;

/** 4位数字验证码正则 */
export const REGEXP_CODE_FOUR = /^\d{4}$/;

/** url链接正则 */
export const REGEXP_URL =
  /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

/** 数据集名称正则，可以带汉字,可以带下划线 */

export const REGEXP_DATASET_NAME = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/;

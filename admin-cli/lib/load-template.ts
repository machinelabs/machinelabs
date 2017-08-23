import * as fs from 'fs';
import { templates } from '../config-templates/templates';


export function tryLoadTemplate(templateName) {

  const personalConfigPath = `${__dirname}/../config-templates/personal/template.personal.js`;
  const hasPersonalConfig = fs.existsSync(personalConfigPath);
  const isBuiltInConfig = templates[templateName];
  const personalTemplates = hasPersonalConfig ? require(personalConfigPath).templates : {};
  const isPersonalConfig = personalTemplates[templateName];

  if (!isPersonalConfig && !isBuiltInConfig) {
    throw new Error(`Can't find template ${templateName}`);
  }

  return isPersonalConfig ? personalTemplates[templateName] : templates[templateName];
}

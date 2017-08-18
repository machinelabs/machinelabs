import * as fs from 'fs';
import { templates } from '../config-templates/templates';

export function getPersonalTemplatePath(templateName) {
  return `${__dirname}/../config-templates/personal/template.${templateName}`;
}

export function tryLoadTemplate(templateName) {

  const templatePath = getPersonalTemplatePath(templateName);
  const isPersonalConfig = fs.existsSync(`${templatePath}.js`);
  const isBuiltInConfig = templates[templateName];

  if (!isPersonalConfig && !isBuiltInConfig) {
    throw new Error(`Can't find template ${templateName}`);
  }

  return isPersonalConfig ? require(templatePath) : templates[templateName];
}

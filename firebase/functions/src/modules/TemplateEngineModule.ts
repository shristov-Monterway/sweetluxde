import { promises as fs } from 'fs';
import * as path from 'path';
import * as mustache from 'mustache';

export interface TemplateEngineModuleType {
  build: (
    id: string,
    placeholders: {
      [key: string]: string;
    }
  ) => Promise<string>;
}

const TemplateEngineModule = (): TemplateEngineModuleType => {
  const templatesDir = path.join(__dirname, '../../src/templates');

  return {
    build: async (id, placeholders) => {
      const templatePath = path.join(templatesDir, `${id}.mustache`);
      const template = await fs.readFile(templatePath, 'utf8');
      return mustache.render(template, placeholders);
    },
  };
};

export default TemplateEngineModule;

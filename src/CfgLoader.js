import EventEmitter from 'events';
import superagent from 'superagent';
import Ajv from 'ajv';
import yaml from 'js-yaml';
import cfgSchema from './schemas/cfg.schema.json';

/**
 * Loads and validates the config file
 */
export default class CfgLoader {
  constructor() {
    this.events = new EventEmitter();

    this.ajv = new Ajv();
    this.validateCfg = this.ajv.compile(cfgSchema);
  }

  /**
   * Loads and returns the config
   *
   * A cache busting qs will be appended to the cfg URL.
   *
   * Errors are thrown if there are issues reading the cfg file or if it does not validate
   * according to the schema (schemas/cfg.schema.json).
   *
   * @param {string} cfgUrl
   *  Full URL or relative path to the cfg file
   * @return {Promise<object>}
   */
  load(cfgUrl) {
    return superagent.get(`${cfgUrl}?cache=${Date.now()}`)
      .then(response => yaml.safeLoad(response.text))
      .catch((e) => {
        throw new Error(`Error parsing ${cfgFile}: ${e.message}`);
      })
      .then((cfg) => {
        if (!this.validateCfg(cfg)) {
          throw new Error(`Error in ${cfgFile}: ${this.ajv.errorsText(this.validateCfg.errors)}`);
        }
        return cfg;
      });
  }
}

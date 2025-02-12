/**
 * Essential module for creating/loading the app config
 */

import path from 'path';
import electron from 'electron';
import teeny from 'teeny-conf';

import { Config, Repeat, SortBy, SortOrder } from '../../shared/types/museeks';
import Module from './module';

const { app } = electron;

class ConfigModule extends Module {
  protected workArea: Electron.Rectangle;
  protected conf: teeny | undefined;

  constructor() {
    super();

    this.workArea = electron.screen.getPrimaryDisplay().workArea;
  }

  async load(): Promise<void> {
    const defaultConfig: Partial<Config> = this.getDefaultConfig();
    const pathUserData = app.getPath('userData');

    this.conf = new teeny(path.join(pathUserData, 'config.json'), defaultConfig);

    // Check if config update
    let configChanged = false;

    (Object.keys(defaultConfig) as (keyof Config)[]).forEach((key) => {
      if (this.conf && this.conf.get(key) === undefined) {
        this.conf.set(key, defaultConfig[key]);
        configChanged = true;
      }
    });

    // save config if changed
    if (configChanged) this.conf.save();
  }

  getDefaultConfig(): Config {
    const config: Config = {
      theme: '__system',
      audioVolume: 1,
      audioPlaybackRate: 1,
      audioOutputDevice: 'default',
      audioMuted: false,
      audioShuffle: false,
      audioRepeat: Repeat.NONE,
      defaultView: 'library',
      librarySort: {
        by: SortBy.ARTIST,
        order: SortOrder.ASC,
      },
      playlistAdding: false,
      sleepBlocker: false,
      autoUpdateChecker: true,
      minimizeToTray: false,
      displayNotifications: true,
      bounds: {
        width: 1000,
        height: 600,
        x: Math.round(this.workArea.width / 2),
        y: Math.round(this.workArea.height / 2),
      },
    };

    return config;
  }

  getConfig(): Config {
    if (!this.conf) {
      throw new Error('Config not loaded');
    }

    return this.conf.get() as Config; // Maybe possible to type TeenyConf with Generics?
  }

  get<T extends keyof Config>(key: T): Config[T] {
    if (!this.conf) {
      throw new Error('Config not loaded');
    }

    return this.conf.get(key);
  }

  set<T extends keyof Config>(key: T, value: Config[T]): void {
    if (!this.conf) {
      throw new Error('Config not loaded');
    }

    return this.conf.set(key, value);
  }

  save(): void {
    if (!this.conf) {
      throw new Error('Config not loaded');
    }

    return this.conf.save();
  }

  reload(): void {
    if (!this.conf) {
      throw new Error('Config not loaded');
    }

    this.conf.reload();
  }
}

export default ConfigModule;

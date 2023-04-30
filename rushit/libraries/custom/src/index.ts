import Jimp, {
  addType,
  addJimpMethods,
  addConstants,
  jimpEvChange,
  FunctionRet,
  JimpPlugin,
  JimpType
} from '@jimp/core';

declare module "@jimp/core" {
  export default class Jimp {
    static decoders: any;
    static encoders: any;
    static hasAlpha: any;
  }
}



export default function configure<TypesFuncArr extends FunctionRet<JimpType> | undefined = undefined,
PluginFuncArr extends FunctionRet<JimpPlugin> | undefined = undefined,
J extends typeof Jimp = typeof Jimp>(configuration, jimpInstance = Jimp) {
  const jimpConfig = {
    hasAlpha: {},
    encoders: {},
    decoders: {},
    class: {},
    constants: {}
  };

  function addToConfig(newConfig) {
    Object.entries(newConfig).forEach(([key, value]) => {
      jimpConfig[key] = {
        ...jimpConfig[key],
        ...value as any
      };
    });
  }

  function addImageType(typeModule) {
    const type = typeModule();

    if (Array.isArray(type.mime)) {
      addType(...type.mime as [string, string]);
    } else {
      Object.entries(type.mime).forEach(mimeType => addType(...mimeType as [string, string]));
    }

    delete type.mime;
    addToConfig(type);
  }

  function addPlugin(pluginModule) {
    const plugin = pluginModule(jimpEvChange) || {};
    if (!plugin.class && !plugin.constants) {
      // Default to class function
      addToConfig({ class: plugin });
    } else {
      addToConfig(plugin);
    }
  }

  if (configuration.types) {
    configuration.types.forEach(addImageType);

    jimpInstance.decoders = {
      ...jimpInstance.decoders,
      ...jimpConfig.decoders
    };
    jimpInstance.encoders = {
      ...jimpInstance.encoders,
      ...jimpConfig.encoders
    };
    jimpInstance.hasAlpha = {
      ...jimpInstance.hasAlpha,
      ...jimpConfig.hasAlpha
    };
  }

  if (configuration.plugins) {
    configuration.plugins.forEach(addPlugin);
  }

  addJimpMethods(jimpConfig.class, jimpInstance);
  addConstants(jimpConfig.constants, jimpInstance);

  return Jimp;
}

import { Material } from 'https://cdn.skypack.dev/three@0.136.0/src/materials/Material.js';
import { Color } from 'https://cdn.skypack.dev/three@0.136.0/src/math/Color.js';

class LitSpriteMaterial extends Material {

    constructor(parameters) {

        super();
        this.isSpriteMaterial = true;
        this.type = 'SpriteMaterial';
        this.color = new Color(0xFFFFFF);
        this.map = null;
        this.alphaMap = null;
        this.rotation = 0;
        this.sizeAttenuation = true;
        this.transparent = true;
        this.fog = true;
        this.setValues(parameters);

    }

    copy(source) {
        super.copy(source);
        this.color.copy(source.color);
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.rotation = source.rotation;
        this.sizeAttenuation = source.sizeAttenuation;
        this.fog = source.fog;
        return this;
    }
}

export { LitSpriteMaterial };
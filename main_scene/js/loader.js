import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

export const loadModels = (models) => {
    return new Promise((resolve, reject) => {
        const promises = models.map((model) => {
            return loadModel(model);
        });
        return resolve(Promise.all(promises.map((promise) => processPromises(promise))));
    });
};

export const loadModel = (model) => {

    switch (model.type) {
        case "fbx":
            return loadFBX(model);
        case "gltf":
            return loadGLTF(model);
        case "obj":
            return loadOBJ(model);
        case "fruit":
            //const fruit = model.models.map((model) => loadModel(model));
            //console.log(fruit)
            return loadFruit(model);
        default:
            return Promise.reject(new Error("Invalid model type"));

    }
}

function processPromises(structure) {
    console.log(structure.type)
    console.log(structure)

    if (structure.type && structure.type === 'fruit') {
        // If it's an array, map through the elements and process each one
        return Promise
            .all(structure.models.map(processPromises))
            .then(resolvedModels => ({...structure, models: resolvedModels}));
    } else if (structure instanceof Promise) {
        // If it's a promise, return it as is
        return structure;
    } else {
        // Otherwise, return the value directly
        return Promise.resolve(structure);
    }
}

export const loadFruit = (model) => {
    return {
        ...model,
        models: model.models.map((model) => loadModel(model))
    }
}

export const loadGLTF = (model) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            model.src,
            (object) => {
                console.log("✅", model.id, "model loaded");
                console.log(object)
                resolve({...model, object, animation: object.animations});
            },
            (xhr) => {
            },
            (error) => {
                console.error("An error happened", error);
                reject(error);
            }
        );
    });
};

export const loadFBX = (model) => {
    return new Promise((resolve, reject) => {
        const loader = new FBXLoader();
        loader.load(
            model.src,
            (object) => {
                console.log("✅", model.id, "model loaded");
                resolve({...model, object});
            },
            (xhr) => {
            },
            (error) => {
                console.error("An error happened", error);
                reject(error);
            }
        );
    });
};

export const loadOBJ = (model) => {
    return new Promise((resolve, reject) => {
        const loader = new OBJLoader();
        loader.load(
            model.src,
            (object) => {
                console.log("✅", model.id, "model loaded");
                resolve({...model, object});
            },
            (xhr) => {
            },
            (error) => {
                console.error("An error happened", error);
                reject(error);
            }
        );
    });
};

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';
import * as BABYLON from 'babylonjs';
import { Button } from "antd";

import { Application } from "@yulintu/freesia-bootstrap";

import "./index.less";
import Animator from '../../framework/Animator';

const HelloBabylon = function (props) {

    const context = useContext(Application.Context);
    const canvas = useRef();

    const [engine, setEngine] = useState();
    const [scene, setScene] = useState();

    const [animatorY] = useState(new Animator());
    const [animatorAlpha] = useState(new Animator());
    const [animatorScale] = useState(new Animator());

    useEffect(() => {
        const engine = new BABYLON.Engine(canvas.current, true);
        setEngine(engine);
    }, []);

    useEffect(() => {

        if (!engine)
            return;

        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        setScene(scene);

        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 50, new BABYLON.Vector3(0, 0, 0));
        camera.upperBetaLimit = Math.PI / 2.2;
        camera.upperRadiusLimit = 100;
        camera.lowerRadiusLimit = 10;
        camera.upperAlphaLimit = 0;
        camera.lowerAlphaLimit = -Math.PI / 2;
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0));
        const light2 = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0, -1, 1), scene);
        light2.position = new BABYLON.Vector3(0, 10, -30);
        const light3 = new BABYLON.DirectionalLight("dir03", new BABYLON.Vector3(0, -1, -1), scene);
        light3.position = new BABYLON.Vector3(0, 10, 30);
        const light4 = new BABYLON.DirectionalLight("dir04", new BABYLON.Vector3(1, -1, 0), scene);
        light4.position = new BABYLON.Vector3(-30, 10, 0);
        const light5 = new BABYLON.DirectionalLight("dir05", new BABYLON.Vector3(-1 - 1, 0), scene);
        light5.position = new BABYLON.Vector3(30, 10, 0);

        const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
        largeGroundMat.diffuseTexture = new BABYLON.Texture("/data/dem/无标题.png");
        largeGroundMat.specularColor = new BABYLON.Color3(0, 0, 0);
        largeGroundMat.alpha = 0;

        const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "/data/dem/tif3.png", { width: 36.01, height: 36.01, subdivisions: 30, minHeight: 0, maxHeight: 5 });
        largeGround.material = largeGroundMat;
        largeGround.position.y = -5;

        const boxMat = new BABYLON.StandardMaterial("largeGroundMat");
        boxMat.diffuseTexture = new BABYLON.Texture("/data/dem/land.jpg");
        boxMat.alpha = 0;

        const faceUV = [];
        faceUV[0] = new BABYLON.Vector4(0.0, 0.0, 15.0, 1.0); //rear face
        faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 15.0, 1.0); //rear face
        faceUV[2] = new BABYLON.Vector4(0.0, 0.0, 15.0, 1.0); //rear face
        faceUV[3] = new BABYLON.Vector4(0.0, 0.0, 15.0, 1.0); //rear face

        const box = BABYLON.MeshBuilder.CreateBox("box", {
            width: 36.01,
            depth: 36.01,
            height: 3,
            faceUV: faceUV,
            wrap: true
        });
        box.position.y = -6.51;
        box.material = boxMat;

        animatorY.onChanged(e => {
            largeGround.position.y = e.groundY;
            box.position.y = e.boxY;
        })

        animatorAlpha.onChanged(e => {
            largeGroundMat.alpha = e.alpha;
            boxMat.alpha = e.alpha;
        })

        animatorScale.onChanged(e => {
            largeGround.scaling.y = e.scale;
        })

        scene.onBeforeRenderObservable.add(() => {
        });

    }, [engine, animatorY, animatorAlpha, animatorScale]);

    useEffect(() => {
        engine?.runRenderLoop(() => {
            scene?.render();
        });
    }, [engine, scene])

    const size = useSize(canvas.current);

    useEffect(() => {
        engine?.resize();
    }, [engine, size?.width, size?.height])

    return <>
        <div className='babylon-frame'>
            <canvas ref={canvas}></canvas>
            <div className='action-bar'>
                <Button onClick={e => {
                    animatorY.from({ groundY: -5, boxY: -6.51 }).to({ groundY: 0, boxY: -1.51, }, 2000).start();
                    animatorAlpha.from({ alpha: 0 }).to({ alpha: 1 }, 1000).start();
                    animatorScale.from({ scale: 0.1 }).to({ scale: 1 }, 2000).start();
                }}>出现</Button>
                <Button onClick={e => {
                    animatorY.from({ groundY: 0, boxY: -1.51 }).to({ groundY: -5, boxY: -6.51 }, 2000).start();
                    animatorAlpha.from({ alpha: 1 }).to({ alpha: 0 }, 1000).start();
                    animatorScale.from({ scale: 1 }).to({ scale: 0.1 }, 2000).start();
                }}>消失</Button>
            </div>
        </div>
    </>
}

export default HelloBabylon;
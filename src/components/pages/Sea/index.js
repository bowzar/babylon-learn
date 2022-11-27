import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';
import * as BABYLON from 'babylonjs';
import * as BABYLON_Materials from 'babylonjs-materials';
import { Button } from "antd";

import { Application } from "@yulintu/freesia-bootstrap";

import "./index.less";
import Animator from '../../framework/Animator';

const Sea = function (props) {

    const context = useContext(Application.Context);
    const canvas = useRef();

    const [engine, setEngine] = useState();
    const [scene, setScene] = useState();
    const [camera, setCamera] = useState();
    const [target, setTarget] = useState();

    const [animatorCamera] = useState(new Animator());
    const [animatorCameraMove] = useState(new Animator());

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
        scene.debugLayer.show({
            embedMode: true,
        });
        // scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        setScene(scene);

        scene.onPointerObservable.add(e => {

            switch (e.type) {
                case BABYLON.PointerEventTypes.POINTERPICK:
                    if (e.pickInfo.hit) {
                        animatorCameraMove.from({
                            radius: camera.radius,
                            targetX: camera.target.x,
                            targetY: camera.target.y,
                            targetZ: camera.target.z,
                        }).to({
                            radius: Math.min(200, camera.radius),
                            targetX: e.pickInfo.pickedPoint.x,
                            targetY: e.pickInfo.pickedPoint.y,
                            targetZ: e.pickInfo.pickedPoint.z,
                        }).start();
                    }

                    break;

                default:
                    break;
            }
        });

        // const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, 0));
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 3, Math.PI / 2.5, 500, new BABYLON.Vector3(0, 0, 0));
        camera.upperBetaLimit = Math.PI / 2.2;
        camera.upperRadiusLimit = 1000;
        camera.lowerRadiusLimit = 100;
        camera.upperAlphaLimit = 0;
        camera.lowerAlphaLimit = -Math.PI / 2;
        camera.panningSensibility = 20;
        camera.attachControl(canvas, true);

        setCamera(camera);

        animatorCamera.onChanged(e => {
            camera.radius = e.radius;
            camera.alpha = e.alpha;
            camera.beta = e.beta;
            camera.target.x = e.targetX;
            camera.target.y = e.targetY;
            camera.target.z = e.targetZ;
        });

        animatorCameraMove.onChanged(e => {
            camera.radius = e.radius;
            camera.target.x = e.targetX;
            camera.target.y = e.targetY;
            camera.target.z = e.targetZ;
        });

        const target = BABYLON.MeshBuilder.CreateBox("target", { size: 1, });
        const targetMat = new BABYLON.StandardMaterial("targetMat");
        targetMat.alpha = 0;
        targetMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        target.material = targetMat;
        target.position.y = 0;

        // camera.lockedTarget = target;
        setTarget(target);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0));
        const light2 = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0, -1, 0), scene);
        light2.position = new BABYLON.Vector3(0, 100, 0);

        let faceUV = [];
        faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //rear face
        faceUV[2] = new BABYLON.Vector4(0.25, 0.0, 0.5, 1.0); //rear face
        faceUV[3] = new BABYLON.Vector4(0.75, 0.0, 1, 1.0); //rear face

        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 5000, faceUV, wrap: true });
        skybox.position.y = 2000;
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox");
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseTexture = new BABYLON.Texture("/data/skybox/1.png");
        // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
        // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        var waterMaterial = new BABYLON_Materials.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
        waterMaterial.bumpTexture = new BABYLON.Texture("/data/wave/bump.png", scene);
        waterMaterial.windForce = 10;//风速,表示施加在水面上的风力
        waterMaterial.bumpHeight = .5;//颠簸高度
        waterMaterial.waveHeight = 1;//浪高
        waterMaterial.waveLength = .1;//浪长度
        waterMaterial.waveSpeed = 10.0;//流速
        waterMaterial.waterColor = new BABYLON.Color3(0, 0.3, 0.8);//海水的颜色
        waterMaterial.colorBlendFactor = 0.08;//混色量,决定水色如何与反射和折射世界混合的因素
        waterMaterial.windDirection = new BABYLON.Vector2(1, 1); //风向

        waterMaterial.addToRenderList(skybox);

        const ground = BABYLON.MeshBuilder.CreateGround("largeGround", { width: 4500, height: 4500 });
        ground.material = waterMaterial;
        ground.position.y = -10;

        const largeGroundBorderMat = new BABYLON.StandardMaterial("largeGroundBorderMat");
        largeGroundBorderMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        const groundBorder = BABYLON.MeshBuilder.CreateGround("largeGroundBorder", { width: 5500, height: 5500 });
        groundBorder.material = largeGroundBorderMat;
        groundBorder.position.y = -15;

        const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
        largeGroundMat.diffuseTexture = new BABYLON.Texture("/data/dem/无标题.png");
        largeGroundMat.specularColor = new BABYLON.Color3(0, 0, 0);
        largeGroundMat.alpha = 0;

        const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "/data/dem/tif3.png", { width: 360, height: 360, subdivisions: 30, minHeight: 0, maxHeight: 50 });
        largeGround.material = largeGroundMat;
        largeGround.position.y = -74.9;

        const boxMat = new BABYLON.StandardMaterial("largeGroundMat");
        boxMat.diffuseTexture = new BABYLON.Texture("/data/dem/base3.jpeg");
        boxMat.specularColor = new BABYLON.Color3(0, 0, 0);
        boxMat.alpha = 0;

        faceUV = [];
        faceUV[0] = new BABYLON.Vector4(0.0, 0.0, 15.0, 1.0); //rear face
        faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 15.0, 1.0); //rear face
        faceUV[2] = new BABYLON.Vector4(0.0, 0.0, 15.0, 1.0); //rear face
        faceUV[3] = new BABYLON.Vector4(0.0, 0.0, 15.0, 1.0); //rear face

        const box = BABYLON.MeshBuilder.CreateBox("box", {
            width: 360,
            depth: 360,
            height: 10,
            faceUV: faceUV,
            wrap: true
        });
        box.position.y = -80;
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

    }, [engine, animatorCamera, animatorCameraMove, animatorY, animatorAlpha, animatorScale]);

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
                    animatorY.from({ groundY: -54.9, boxY: -60 }).to({ groundY: 25.1, boxY: 20, }, 2000).start();
                    animatorAlpha.from({ alpha: 0 }).to({ alpha: 1 }, 1000).start();
                    animatorScale.from({ scale: 0 }).to({ scale: 1 }, 2000).start();
                }}>出现</Button>
                <Button onClick={e => {
                    animatorY.from({ groundY: 25.1, boxY: 20, }).to({ groundY: -54.9, boxY: -60 }, 2000).start();
                    animatorAlpha.from({ alpha: 1 }).to({ alpha: 0 }, 1000).start();
                    animatorScale.from({ scale: 1 }).to({ scale: 0 }, 2000).start();
                }}>消失</Button>
                <Button onClick={e => {
                    animatorCamera.from({
                        radius: camera.radius,
                        alpha: camera.alpha,
                        beta: camera.beta,
                        targetX: camera.target.x,
                        targetY: camera.target.y,
                        targetZ: camera.target.z,
                    }).to({
                        radius: 500,
                        alpha: -Math.PI / 3,
                        beta: Math.PI / 2.5,
                        targetX: 0,
                        targetY: 0,
                        targetZ: 0,
                    }).start();
                }}>移动</Button>
            </div>
        </div>
    </>
}

export default Sea;
<CsoundSynthesizer>
<CsOptions>
-odac
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 64
nchnls = 2
0dbfs = 1


instr 1
kVolume chnget "globalVolume"
kFan chnget "fanLevel"
kPlane chnget "planeLevel"
kAc chnget "acunitLevel"
kTrain chnget "trainLevel"

a1,a2 diskin2 "fan.wav",1,0,1
a1w,a2w diskin2 "plane.wav",1,0,1
a1s,a2s diskin2 "acunit.wav",1,0,1
a1l,a2l diskin2 "train.wav",1,0,1
asig noise 0.5, 0
amix1 = a1*kFan+a1w*kPlane+a1s*kAc+a1l*kTrain
amix2 = a2*kFan+a2w*kPlane+a2s*kAc+a2l*kTrain
outs amix1*kVolume, amix2*kVolume
endin


</CsInstruments>
<CsScore>
i1 0 z
</CsScore>
</CsoundSynthesizer>





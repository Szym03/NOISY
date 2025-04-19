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
kBirds chnget "birdLevel"
kStream chnget "streamLevel"
kWind chnget "windLevel"
kLeaf chnget "rustleLevel"

a1,a2 diskin2 "ambience.wav",1,0,1
a1w,a2w diskin2 "wind.wav",1,0,1
a1s,a2s diskin2 "stream.wav",1,0,1
a1l,a2l diskin2 "leaves.wav",1,0,1
asig noise 0.5, 0
amix1 = a1*kBirds+a1w*kWind+a1s*kStream+a1l*kLeaf
amix2 = a2*kBirds+a2w*kWind+a2s*kStream+a2l*kLeaf
outs amix1*kVolume, amix2*kVolume
endin


</CsInstruments>
<CsScore>
i1 0 999999
</CsScore>
</CsoundSynthesizer>





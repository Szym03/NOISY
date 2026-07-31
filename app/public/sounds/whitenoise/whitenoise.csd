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
asig noise 0.5, 0
outs asig*kVolume, asig*kVolume
endin


</CsInstruments>
<CsScore>
i1 0 999999
</CsScore>
</CsoundSynthesizer>





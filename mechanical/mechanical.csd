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

asig pinker 

outs asig*kVolume, asig*kVolume
endin


</CsInstruments>
<CsScore>
i1 0 z
</CsScore>
</CsoundSynthesizer>





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
kenv linseg 0, 1, 1
asig pinker
outs asig*kenv*kVolume, asig*kenv*kVolume
endin


</CsInstruments>
<CsScore>
i1 0 999999
</CsScore>
</CsoundSynthesizer>
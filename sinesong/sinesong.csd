<CsoundSynthesizer>
<CsOptions>
-odac
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 64
nchnls = 2
0dbfs = 1



;reverb buffers
gaRvbSendL init 0
gaRvbSendR init 0 
;minor pentatonic arays
giArr1[] fillarray 110.00, 130.81, 146.83, 164.81, 196.00
giArr2[] fillarray 220.00, 261.63, 293.66, 329.63, 392.00
giArr3[] fillarray 440.00, 523.25, 587.33, 659.25, 784.00
instr 1 ; notes 
  kVolume chnget "globalVolume"
  kenv linen 0.1, p3/2, p3, p3/2
  asig oscili kenv, p4
  outs asig * p5 * kVolume, asig *(1 - p5)*kVolume
  gaRvbSendL    =         gaRvbSendL + (asig * 0.9)
  gaRvbSendR    =         gaRvbSendR + (asig * 0.9)
endin

instr 2 ; scheduler
  irampdur1 = 1 + rnd(4)
  irampdur2 = 1 + rnd(4)
  irampdur3 = 1 + rnd(4)
  irandpitch1 = floor(rnd(4.9))
  irandpitch2 = floor(rnd(4.9))
  irandpitch3 = floor(rnd(4.9))

  schedule(1, 0, irampdur1, giArr1[irandpitch1],0.5) 
  schedule(1, 0, irampdur2, giArr2[irandpitch2],rnd(1))
  schedule(1, 0, irampdur3, giArr3[irandpitch3],rnd(1))
  schedule(2, irampdur1+rnd(7), 0.1) 
endin

instr 3; reverb
	kroomsize    init      0.99     
	kHFDamp      init      0.9       
aRvbL,aRvbR  freeverb  gaRvbSendL, gaRvbSendR,kroomsize,kHFDamp
             outs      aRvbL, aRvbR
             clear     gaRvbSendL
             clear     gaRvbSendR
endin
</CsInstruments>

<CsScore>
i2 0 z
i3 0 z
</CsScore>
</CsoundSynthesizer>




<bsbPanel>
 <label>Widgets</label>
 <objectName/>
 <x>100</x>
 <y>100</y>
 <width>320</width>
 <height>240</height>
 <visible>true</visible>
 <uuid/>
 <bgcolor mode="background">
  <r>240</r>
  <g>240</g>
  <b>240</b>
 </bgcolor>
</bsbPanel>
<bsbPresets>
</bsbPresets>

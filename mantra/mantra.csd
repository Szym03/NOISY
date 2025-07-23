<CsoundSynthesizer>
<CsOptions>
-odac
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 64
nchnls = 2
0dbfs = 1

;change for a different piece
seed 4011953085

;reverb buffers
gadelayL, gadelayR, gamixL, gamixR, gaRvbSendR, gaRvbSendL init 0

;note arrays 
giArr1[] fillarray 130.81, 146.83, 164.81, 220.00, 246.94
giArr2[] fillarray 261.63, 293.66, 329.63, 440.00, 493.88
giArr3[] fillarray 523.25, 587.33, 659.25, 880.00, 987.77

;waves 
giTri     ftgen     0, 0, 2^10, 10, 1, 0, -1/9, 0, 1/25, 0, -1/49, 0, 1/81
giSine    ftgen     1, 0, 16384, 10, 1

;get slider
gkVolume chnget "globalVolume"
instr 1 ; notes 
  gkVolume chnget "globalVolume"
  kenv linen 0.2, p3/2, p3, p3/2
  asig buzz kenv, p4, kenv*30, giSine
  		outs asig * p5 * gkVolume*0.2, asig *(1 - p5)*gkVolume*0.2
  		gaRvbSendL    =         gaRvbSendL + (asig * 0.2)*gkVolume
  		gaRvbSendR    =         gaRvbSendR + (asig * 0.2)*gkVolume
endin

instr 2 ; scheduler

  irampdur1 = 1 + rnd(4)
  irampdur2 = 1 + rnd(2)
  irampdur3 = 1 + rnd(2)
  irandpitch1 = floor(rnd(4.9))
  irandpitch2 = floor(rnd(4.9))
  irandpitch3 = floor(rnd(4.9))
  
  schedule(1, 0, irampdur1, giArr1[irandpitch1],0.4) 
  schedule(1, 0, irampdur2, giArr2[irandpitch2],rnd(0.9))
  schedule(1, 0, irampdur3, giArr3[irandpitch3],rnd(0.9))
   
  
  girest random 5, 10
  gipercdur random 2, girest/2
  ichance random 0,100
  if (ichance < 55) then
  	schedule(3, irampdur1, gipercdur)
  endif
  if (ichance > 65) then
  	schedule(4, irampdur1, gipercdur,giArr1[irandpitch1])
  endif
  schedule(2, girest, 0.1)
  
endin

instr 3; percussive
	
	krate rspline 2, 15, 0.5,2
	kamp linen 1, gipercdur/3,gipercdur,gipercdur*rnd(0.6)
	kenv lfo 0.2,krate,5
	kpan rspline 0,1,1,2

	anoise noise kenv*kamp, 0.99*1-kamp
	anoisef lowpass2 anoise, 8000*1-kamp, 0
	asig comb anoisef, 1, 0.2,-0.2
	
	aoutl  = asig*0.1*gkVolume
	aoutr  = asig*(1-kpan)*0.1*gkVolume

	
	gamixL = gamixL + aoutl*0.4*gkVolume
	gamixR = gamixR + aoutr *0.4*gkVolume
	gaRvbSendL = gaRvbSendL + aoutl*gkVolume
   gaRvbSendR = gaRvbSendR + aoutr*gkVolume
   
endin



instr 4 ;bass
	kenv linen 0.04, p3*0.05, p3, p3*0.95
	asig oscil kenv*0.5, p4/2, giTri
	gaRvbSendL = gaRvbSendL + asig*gkVolume
   gaRvbSendR = gaRvbSendR + asig*gkVolume
	outs asig, asig*gkVolume
endin

instr 97;delay
  	asigL, asigR init 0
	asigL delay gadelayL+(asigL*0.7), 1
	asigR delay gadelayR+(asigL*0.72), 0.5
 		outs asigL, asigR
 		clear gadelayL, gadelayR
endin
	
instr 98; reverb
	kroomsize    init      0.99     
	kHFDamp      init      0.9       
	aRvbL,aRvbR  freeverb  gaRvbSendL, gaRvbSendR,kroomsize,kHFDamp
             outs      aRvbL, aRvbR
             clear     gaRvbSendL
             clear     gaRvbSendR
endin

instr 99; resonant reverb 

	krvt =  1
	ilpt =  0.01
	aleft	comb gamixL, krvt, ilpt*.2
	aright	comb gamixR, krvt, ilpt*.1
   gadelayL = gadelayL + aleft*0.5
   gadelayR = gadelayR + aright*0.5
		outs   aleft, aright
		clear gamixL,gamixR	
 
endin

</CsInstruments>

<CsScore>
i2 0 z
i97 0 z
i98 0 z
i99 0 z
</CsScore>

</CsoundSynthesizer>
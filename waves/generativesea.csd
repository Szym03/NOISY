<CsoundSynthesizer>
<CsOptions>
-odac
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 64
nchnls = 2
0dbfs = 1

seed 0

gaRvbSendL init 0
gaRvbSendR init 0

instr 1
	kVolume chnget "globalVolume"

	kbeta randomi 0,1,0.05
	apink pinker
	awhite noise 0.8, kbeta
   
 
	knum1 randomi 0, 2, 0.05
	knum2 rspline 0, 1, 0.2, 1
	
	knum3 randomi 0, 2, 0.3
	knum4 rspline 0, 1, 0.2, 1
	
	al = (knum1*apink+knum2*awhite)*kVolume*0.5
	ar = (knum3*apink+knum4*awhite)*kVolume*0.5

	gaRvbSendL = gaRvbSendL + al
	gaRvbSendR = gaRvbSendR + ar

	outs al,ar
	
	
	
endin

instr 2
	kroomsize    init      0.9 
	kHFDamp      init      0.8      
	
	aRvbL,aRvbR  freeverb  gaRvbSendL, gaRvbSendR,kroomsize,kHFDamp
				outs      aRvbL, aRvbR
				clear     gaRvbSendL
				clear 	  gaRvbSendR   
endin

</CsInstruments>

<CsScore>
i1 0 z
i2 0 z
</CsScore>
</CsoundSynthesizer>


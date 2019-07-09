//UTILITY CLASS
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

char* unescape(char* s,char quote){ //removse each second occurence of quote 
	char *unescapedS = malloc(strlen(s)*sizeof(char));
	int i, j;
	for(i = j = 0; i < (strlen(s)-1); i++){
		unescapedS[j]=s[i];
		if(s[i] == quote){
			
			if(s[i+1]==quote) {i++; }
		}
		j++;
	}
	return unescapedS;
 return s;
}	

char* escape(char* s,char quote){ //removse each second occurence of quote 
	int q = 0;
	int i,h,k;
	for(i =0 ; i < strlen(s); i++){
		if(s[i]==quote) q++;
	};
	char *escapedS = malloc(strlen(s+q)*sizeof(char));
	
	

	for(h = k = 0; h < strlen(s); h++){
		escapedS[k]=s[h];
		if(s[h] == quote){
			escapedS[k+1]=quote; k++;
		}
		k++;

	}
	return escapedS;
}	

/******************************/


char* decodeBottleString(char* msg){
        char* msgEscaped = msg;
	char* msgUnescaped =unescape(msg,'"');
	return msgUnescaped;
}

char* encodeBottleString(char* msg){
	int i;
	char* msgEscaped = escape(msg,'"');

	char* msgEncoded = malloc(strlen(msgEscaped+2));

	msgEncoded[0]='"';
	int ln = strlen(msgEscaped);
	for(i =0; i<ln;i++){
		msgEncoded[i+1]=msgEscaped[i];
	}
	msgEncoded[ln+1] = msgEncoded[ln];
	msgEncoded[ln]='"';

	return msgEncoded;

}



int main(){
	char* s = "CIAO \"ALE\"";
	char* e = encodeBottleString(s);
	printf("Encoded %s => %s\n", s,e);
	
	char* e1 = escape(s,'"');
	char* d1 = decodeBottleString(e1);
	printf("Original: %s, Escaped: %s, Decoded: %s\n",s,e1,d1);
	
}

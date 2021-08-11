export const vertShader = `

uniform float uTime;
float time =  uTime * 0.00005;




vec3 gln_rand3(vec3 p){return mod(((p*34.0)+1.0)*p,289.0);}
vec4 _permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 _taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float gln_simplex(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1;i1=(x0.x>x0.y)? vec2(1.0,0.0): vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.0);
  vec3 p=gln_rand3(gln_rand3(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;

  return 130.0*dot(m,g);
  }

float gln_simplex(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+1.0*C.xxx;
  vec3 x2=x0-i2+2.0*C.xxx;
  vec3 x3=x0-1.+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=_permute(_permute(_permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=_taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;
  p1*=norm.y;
  p2*=norm.z;
  p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

vec3 _snois3(vec3 x){
  float s=gln_simplex(vec3(x));
  float s1=gln_simplex(vec3(x.y-19.1,x.z+33.4,x.x+47.2));
  float s2=gln_simplex(vec3(x.z+74.2,x.x-124.5,x.y+99.4));
  vec3 c=vec3(s,s1,s2);return c;}

vec3 gln_curl(vec3 p){
  const float e=.1;vec3 dx=vec3(e,0.0,0.0);vec3 dy=vec3(0.0,e,0.0);vec3 dz=vec3(0.0,0.0,e);
  vec3 p_x0=_snois3(p-dx);
  vec3 p_x1=_snois3(p+dx);
  vec3 p_y0=_snois3(p-dy);
  vec3 p_y1=_snois3(p+dy);
  vec3 p_z0=_snois3(p-dz);
  vec3 p_z1=_snois3(p+dz);
  float x=p_y1.z-p_y0.z-p_z1.y+p_z0.y;
  float y=p_z1.x-p_z0.x-p_x1.z+p_x0.z;
  float z=p_x1.y-p_x0.y-p_y1.x+p_y0.x;
  const float divisor=1.0/(2.0*e);
  return normalize(vec3(x,y,z)*divisor);
}


void main(){
  vec3 value = gln_curl((position * 0.12) + (time * 2));
  gl_Position = vec4(value, 1);
  vec3 newNormal = normal;
}`

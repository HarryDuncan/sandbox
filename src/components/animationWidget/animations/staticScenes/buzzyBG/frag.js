export const fragShader = `	varying vec2 vUv;

  uniform float time;

  uniform float change;
  void main()	{

    // Closeness to camera
    vec2 p = - 1.0 + change * vUv;

    // Controls the speed of ripples
    float a = time * 50.0;

    float d, e, f;

    float g = 1.0 / 30.0;
    float h ,i ,r ,q;


    e = 100.0 * ( p.x * 0.1 + 0.5 );
    f = 400.0 * ( p.y * 0.5 + 0.5 );
    i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
    d = 200.0 + cos( f * g / 2.0 ) * 18.0;
    r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
    q = f / r;
    e = ( r * cos( q ) ) - a / 2.0;
    f = ( r * sin( q ) ) - a / 2.0;
    d =  r;
    h = ( ( f + d ) + a / 2.0 ) * g;
    i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
    h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
    h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
    i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
    i = mod( i / 5.6, 256.0 ) / 64.0;
    if ( i < 0.0 ) i += 4.0;
    if ( i >= 2.0 ) i = 4.0 - i;
    d = r / 350.0;
    d += sin( d * d * 8.0 ) * 0.52;
    f = ( sin( a * g ) + 1.0 ) / 2.0;

    // 4 point vector for color

    gl_FragColor = vec4( vec3( f / 1.6, i + d / 10.0, i ) * d * p.x + vec3( i / 2.2 / 4.0, i + d / 2.0, i + d / 1.2 ) * d , 0.5 );

  }`

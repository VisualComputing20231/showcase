# Visual illusions

## Introducción


{{% justify %}}
En esta seccion se presentaraán algunos fenomenos visuales y su respectiva implementación, además se proporcionara una breve explicacion junto a la fuente de donde se obtuvo la informacion. 

## Motion Aftereffect (Waterfall Illusion)
### Marco Teorico

El fenómeno de la cascada es una ilusión óptica que se produce cuando se observa una cascada o un río en movimiento y luego se mira hacia una superficie estática. La superficie estática parece moverse en la dirección opuesta al flujo original. Este efecto se debe a la adaptación del sistema visual a un estímulo en movimiento que, al desaparecer, produce un efecto residual de movimiento en la dirección opuesta. Este efecto es conocido como "inducción de movimiento".

Este fenómeno ha sido observado desde la antigüedad. Lucrecio, poeta romano del siglo I a.C., describió la ilusión de que las piernas de un caballo estacionado en un río parecían moverse en la dirección opuesta al flujo del agua. El filósofo Aristóteles también hizo referencia a la percepción errónea del movimiento en el agua, aunque en su caso se trata de la percepción de que objetos estáticos parecen moverse.

Investigaciones posteriores han demostrado que el fenómeno de la cascada está mediado por procesos neuronales complejos en el cerebro que procesan y adaptan la percepción visual del movimiento. Estudios modernos han identificado las áreas cerebrales que son responsables de esta adaptación y han ayudado a explicar los mecanismos subyacentes a la ilusión de la cascada.

En resumen, la ilusión de la cascada es un fenómeno óptico que se produce cuando se observa una superficie estática después de haber mirado un objeto en movimiento. Este efecto se debe a la adaptación del sistema visual a estímulos en movimiento que persisten durante unos momentos después de que el estímulo ha desaparecido. Este fenómeno ha sido estudiado desde la antigüedad y ha sido objeto de investigación científica moderna, lo que ha ayudado a comprender mejor los mecanismos neuronales que subyacen a la percepción visual del movimiento.

### Instrucciones

Fíjate en la cruz central durante el movimiento y mira el ciclo al menos tres veces. Observa el efecto de la imagen posterior al movimiento en la figura en reposo (el Buda de Kamakura). La "deformación" causada por el efecto de la imagen posterior al movimiento se aplica a cualquier cosa que observes. También puedes intentar cubrir un ojo, adaptarte durante aproximadamente tres ciclos y luego probar con el otro ojo.

Esto se explica a menudo en términos de "fatiga" de la clase de neuronas que codifican una dirección de movimiento. Sin embargo, es más preciso interpretar esto en términos de adaptación o "control de ganancia". Estos detectores de movimiento no se encuentran en la retina sino en el cerebro (Bach y Hoffmann 2000). Para obtener una explicación más detallada y una demostración interesante del "efecto cascada", consulte la página de [George Mather](http://www.georgemather.com/MotionDemos/MAEMP4.html).
{{% /justify %}}


{{< details title="Waterfall Illusion" open=false >}}
<div style="position: relative;   
  left: 0%;
  top: 50%;
  width: 50%;
  height: 50%;
  padding: 25px;
  text-align: center;
  // TODO: Move this to shortcode"> 
{{< p5-div sketch="/showcase/sketches/waterfall-illusion.js" >}}
</div>
{{< /details >}}


export async function onRequest(context) {
  const { request, env, params } = context;
  const id = params.id;
  const bucket = env.TOURS_BUCKET;

  if (!bucket) return new Response('Bucket não configurado.', { status: 500 });

  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      const foto = formData.get('foto');
      const marcacoes = formData.get('marcacoes');

      if (foto) {
        // Converte para ArrayBuffer (mais seguro para imagens que o stream)
        const arrayBuffer = await foto.arrayBuffer();
        await bucket.put(`tours/${id}.jpg`, arrayBuffer, {
          httpMetadata: { contentType: 'image/jpeg' }
        });
      }
      if (marcacoes) {
        await bucket.put(`tours/${id}.json`, marcacoes, {
          httpMetadata: { contentType: 'application/json' }
        });
      }
      return new Response(JSON.stringify({ ok: true, id }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  return new Response('Método não permitido.', { status: 405 });
}
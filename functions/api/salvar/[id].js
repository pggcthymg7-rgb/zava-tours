export async function onRequest(context) {
  const { request, env, params } = context;
  const id = params.id;
  const bucket = env.TOURS_BUCKET;

  if (!bucket) return new Response('Bucket não configurado.', { status: 500 });

  if (request.method === 'POST') {
    const formData = await request.formData();
    const foto = formData.get('foto');
    const marcacoes = formData.get('marcacoes');

    if (foto) {
      await bucket.put(`tours/${id}.jpg`, foto.stream(), {
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
  }
  return new Response('Método não permitido.', { status: 405 });
}
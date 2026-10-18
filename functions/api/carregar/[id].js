export async function onRequest(context) {
  const { env, params } = context;
  const id = params.id;
  const bucket = env.TOURS_BUCKET;

  if (!bucket) return new Response('Bucket não configurado.', { status: 500 });

  const objeto = await bucket.get(`tours/${id}.json`);

  if (!objeto) return new Response('Tour não encontrado.', { status: 404 });

  const texto = await objeto.text();
  return new Response(texto, {
    headers: { 'Content-Type': 'application/json' }
  });
}
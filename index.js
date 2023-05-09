// @ts-check

const fs = require('fs-extra');

(async () => {
  console.log("Welcome to KDP's Hacky ChatGPT Conversation Extractor");

  const userName = process.env.USER_NAME || 'KDP';
  if (4 !== process.argv.length) throw new Error('Need JSON filename and substring of conversation title.');
  const jsonFile = process.argv[ 2 ];
  const convoTitle = process.argv[ 3 ];

  console.log(`Extracting conversation '${convoTitle}' between ChatGPT and ${userName} from file '${jsonFile}':`);

  const data = await fs.readJSON(jsonFile);
  const convos = data.filter(({ title }) => title.includes(convoTitle));

  if (convos.length > 1) {
    console.log('Found multiple matching conversations; be more specific:');
    convos.forEach(({ title }) => {
      console.log(`  '${title.trim()}'`);
    });

    throw new Error('Non-unique convo match.');
  } else if (0 === convos.length) throw new Error('No convo match.');

  const [ convo ] = convos;
  const out = [];

  // We start with the *last* node in the chain.
  let nodeRef = convo.current_node;
  while (nodeRef) {
    // If we've got at message, re-encode line breaks,
    // labelling it with the correct speaker; shove into the
    // results.
    const node = convo.mapping[ nodeRef ];
    if (node?.message) {
      const text = node.message.content.parts.join(' ').replaceAll('\n', '\\n');

      if (text.length > 0) out.push(`${'assistant' === node.message.author.role ? 'ChatGPT: ' : `${userName}: `}${text}`);
    }

    nodeRef = node.parent;
  }

  // Compensate for processing in reverse order.
  out.reverse();

  // Try to generate a nice filename from the convo title
  // and write everything out.
  const outFileName = convo.title.replaceAll('/', '').replaceAll('\\', '').replaceAll(':', '').replaceAll(' ', '_') + '.txt';
  await fs.writeFile(outFileName, out.join('\n'));
  console.log(`Wrote ${out.length} lines to '${outFileName}'.`);
})();

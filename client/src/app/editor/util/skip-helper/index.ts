export const createSkipText = (skipCount = 0, skipType = 'messages') => {
  const someOrCount = skipCount === 0 ? 'some' : skipCount;

  return `

##################################################################################################
WOAH! LOOK AT ALL THIS EXCITING OUTPUT!

Unfortunately, the output is a little too large, so we had to skip ${someOrCount} ${skipType}.
In the future you'll be able to download the entire log as a textfile.
##################################################################################################

`;
};

export const createSkipTextHelper = (skipType?: string) => {
  let skipped = 0;
  return skipCount => {
    skipped += skipCount;
    return createSkipText(skipped, skipType);
  };
};

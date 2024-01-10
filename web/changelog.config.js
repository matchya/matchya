export const writerOpts = {
  transform: (commit, context) => {
    if (commit.scope === 'web') {
      return commit;
    }
    return false;
  }
};

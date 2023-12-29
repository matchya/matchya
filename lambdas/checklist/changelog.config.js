module.exports = {
  writerOpts: {
    transform: (commit, context) => {
    if (commit.scope === 'checklist') {
        return commit;
    }
    return false;
    }
  }
};

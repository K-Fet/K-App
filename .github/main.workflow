workflow "Call prod webhook" {
  resolves = [
    "Send prod webhook",
  ]
  on = "repository_dispatch"
}

workflow "Call staging webhook" {
  resolves = [
    "Send staging webhook",
    "Filter master branch",
  ]
  on = "repository_dispatch"
}

workflow "Test All" {
  resolves = [
    "Yarn install front",
    "Trigger staging workflow",
    "Trigger prod workflow",
  ]
  on = "push"
}

action "Filter prod branch" {
  uses = "actions/bin/filter@master"
  args = "action deploy-prod"
}

action "Filter master branch" {
  uses = "actions/bin/filter@master"
  args = "action depoy-master"
}

action "Yarn install back" {
  uses = "Borales/actions-yarn@master"
  args = "install --frozen-lockfile"
}

action "Yarn test" {
  uses = "Borales/actions-yarn@master"
  args = "test"
  needs = ["Yarn install back", "Yarn install front"]
}

action "Send staging webhook" {
  uses = "swinton/httpie.action@master"
  needs = [
    "Filter master branch",
  ]
  args = "POST $KAPP_WEBHOOK_URL type=staging token=$KAPP_WEBHOOK_TOKEN"
  secrets = ["KAPP_WEBHOOK_TOKEN"]
  env = {
    KAPP_WEBHOOK_URL = "webhooks.kfet-insa.fr"
  }
}

action "Send prod webhook" {
  uses = "swinton/httpie.action@master"
  needs = ["Filter prod branch"]
  args = "POST $KAPP_WEBHOOK_URL type=prod token=$KAPP_WEBHOOK_TOKEN"
  secrets = ["KAPP_WEBHOOK_TOKEN"]
  env = {
    KAPP_WEBHOOK_URL = "webhooks.kfet-insa.fr"
  }
}

workflow "Update prod branch on release" {
  on = "release"
  resolves = ["Update branch"]
}

action "Update branch" {
  uses = "Embraser01/update-git-branch-action@master"
  args = "--branch prod --force"
  secrets = ["PAT_TOKEN"]
}

action "Yarn install front" {
  uses = "Borales/actions-yarn@master"
  args = "install --cwd client --frozen-lockfile"
}

action "Filter prod dispatch event" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "action deploy-"
}

action "Filter staging" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  needs = ["Yarn test"]
  args = "branch master"
}

action "Filter prod" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  needs = ["Yarn test"]
  args = "branch prod"
}

action "Trigger staging workflow" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["--auth-type=jwt", "--auth=$PAT_TOKEN", "POST", "api.github.com/repos/$GITHUB_REPOSITORY/dispatches", "Accept:application/vnd.github.everest-preview+json", "event_type=deploy-master"]
  secrets = ["PAT_TOKEN"]
  needs = ["Filter staging"]
}

action "Trigger prod workflow" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["--auth-type=jwt", "--auth=$PAT_TOKEN", "POST", "api.github.com/repos/$GITHUB_REPOSITORY/dispatches", "Accept:application/vnd.github.everest-preview+json", "event_type=deploy-prod"]
  needs = ["Filter prod"]
  secrets = ["PAT_TOKEN"]
}

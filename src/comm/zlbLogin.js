    async function getToken(ticket) {
      const res = await this.zz.req({
        url: "Login_gov",
        isVerify: false,
        loading: "登录中...",
        data: { ticket },
      });
      uni.hideLoading();
      if (res.code != 1000) {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        return;
      }

      this.zz.setToken(res.data.accessToken);
      if (res.data.user && res.data.user.id) this.zz.setAcc(res.data.user);

      // 埋点
      aplus_queue &&
        aplus_queue.push({
          action: "aplus.setMetaInfo",
          arguments: ["_user_id", res.data.user["openid"]],
        });
      aplus_queue &&
        aplus_queue.push({
          action: "aplus.setMetaInfo",
          arguments: ["_user_nick", res.data.user["name"]],
        });
      uni.switchTab({
        url: "/pages/index/index",
      });
      uni.showToast({ title: "登录成功！" });
    }
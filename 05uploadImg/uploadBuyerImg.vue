<template>
  <el-upload
    :multiple="isMultiple"
    :class="{ hideAdd: uploadDisabled }"
    :action="action"
    list-type="picture-card"
    v-bind="bindVal"
    v-on="$listeners"
    :headers="headers"
    :on-success="onSuccessUpload"
    :on-error="onError"
    :on-change="onChange"
    :before-upload="beforeUpload"
    :on-remove="onRemoveFile"
    :on-exceed="onExceedFile"
  >
    <i class="el-icon-camera"></i>
    <div slot="item" slot-scope="{item}">
      <img
        class="el-upload-list__item-thumbnail"
        :src="item.url" alt=""
      >
      <span class="el-upload-list__item-actions"/>
      <el-dialog :visible.sync="uploadDisabled">
        <img width="100%" :src="item.url" alt="">
      </el-dialog>
    </div>

  </el-upload>
</template>
<script>
export default {
  name: "yxUploadBuyerImg",
  props: {
    action: {
      type: String,
      default: "/admin/sys-file/upload",
    },
    limit: {
      type: Number,
      default: 9,
    },
    customFileList: {
      // 文件列表
      type: Array,
      default: function _default() {
        return [];
      },
    },
    fileListShowBlob: {
      // 回显的文件列表是否是bolb类型
      type: Boolean,
      default: false,
    },
    isMultiple: {
      // 是否可以批量上传
      type: Boolean,
      default: false,
    },
    onSuccess: Function,
    onRemove: Function,
    onExceed: Function,
  },
  data() {
    return {
      fileListData: [],
      // 控制是否显示图片上传+号
      uploadDisabled: false,
      dialogVisible:false,
      dialogImageUrl:'',
      disabled: false,
      limitData: [
        {
          fileType: "image",
          maxSize: 1 * 1024 * 1024, // 1 M
          isReg: true,
          testReg: this.$typeList.img,
          error: "图片最大上传1M！",
        },
        {
          fileType: "drawing",
          maxSize: 100 * 1024 * 1024, // 100 M
          isReg: true,
          testReg: this.$typeList.drawing,
          error: "图纸最大上传100M！",
        },
      ],
      maxSize: 5 * 1024 * 1024, // 不管什么文件最大上传500M

    };
  },
  computed: {
    headers() {
      let propsHeaders = this.$attrs.headers || {};
      return {
        Authorization: "Bearer " + this.$store.getters.access_token,
        ...propsHeaders,
      };
    },
    bindVal() {
      return {
        limit: this.limit,
        fileList: this.fileListData,
        ...this.$attrs,
      };
    },
  },
  created() {
    this.initFileList();
  },
  methods: {
    // 处理图片回显
    async initFileList() {
      this.fileListData = [];
      let list = this.customFileList;
      if (this.fileListShowBlob) {
        await list.map(async (item, index) => {
          if (
            !this.validatenull(item.url) &&
            item.url.startsWith("/admin/sys-file")
          ) {
            item.url = await this.$file.handleFileUrlToBolb(item.url);
          }
          if (typeof item.uid === "undefined") {
            item.uid = new Date().getTime() + index; // 时间戳
          }
          this.fileListData.push(item);
          return item;
        });
      }
    },
    onSuccessUpload(res, file, fileList) {
      this.fileListData = fileList;
      if (res.code === 0) {
        // this.$emit('on-success',res.data, file, fileList)
        if (typeof this.onSuccess === "function") {
          this.onSuccess(res.data, file, fileList);
        }
      } else {
        this.$message.error(res.msg || "上传失败！");
      }
    },
    onError(err, file, fileList) {
      this.fileListData = fileList;
      this.$message.error(err.msg || "上传失败！");
      this.$emit("on-error", err, file, fileList);
    },
    onChange(file, fileList) {
      this.fileListData = fileList;
      this.$emit("on-change", file, fileList);
    },
    beforeUpload(file) {
      let result = true;
      try {
        // 限制文件大小
        this.limitData.forEach((element) => {
          if (
            element.size > this.maxSize ||
            (element.isReg &&
              element.testReg.test(file.name.toLowerCase()) &&
              file.size > element.maxSize)
          ) {
            result = false;
            this.$message.warning(element.error || "上传文件过大");
            throw new Error("EndIterative");
          }
        });
      } catch (error) {}

      if (!result) {
        return false;
      }

      this.$emit("before-upload", file, (val) => {
        result = val;
      });
      return result;
    },
    onRemoveFile(file, fileList) {
      this.fileListData = fileList;
      if (typeof this.onRemove === "function") {
        this.onRemove(file, fileList);
      }
    },
    onExceedFile(files, fileList) {
      this.fileListData = fileList;
      this.$message.warning("超过最大上传数量啦");
      if (typeof this.onExceed === "function") {
        this.onExceed(files, fileList);
      }
    }
  },
  watch: {
    customFileList: {
      handler() {
        this.initFileList();
      },
      deep: true,
    },
    fileListData: {
      handler() {
        //是否展示图片+号
        this.uploadDisabled = this.fileListData.length >= this.limit;
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.hideAdd {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>

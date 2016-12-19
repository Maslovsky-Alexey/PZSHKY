using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ElectronicSchemModels.Posts
{
    public class LikeModel
    {
        public long ID { get; set; }

        public virtual ApplicationUser User { get; set; }

        public bool isLike { get; set; }

        public virtual PostModel Post { get; set; }

        public virtual Comments.CommentModel Comment { get; set; }
    }
}